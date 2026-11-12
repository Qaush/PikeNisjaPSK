import { config } from "./config";
import { professionsNote } from "./professions";
import { helplines, safetyMessage } from "./safety";
import {
  contributingItems,
  formatScore,
  resultLine,
  type SeverityBand,
  type TestDefinition,
  type TestResult,
} from "./tests";

/**
 * Raporti si dokument (HTML me stile brenda rreshtit, i sigurt për email dhe për printim).
 *
 * Struktura ndjek shembullin që dërgoi psikologia (kërkesa 2j6NSG4n, 12.11.2026):
 * koka me të dhënat e plotësimit → tabela e rezultateve → grafiku i secilës shkallë mbi
 * intervalet e niveleve → interpretimi → informacioni për pikëzimin → përgjigjet e klientit.
 * I njëjti dokument përdoret si trup i emailit dhe te /report/[token]/dokument (për printim/PDF).
 */

const TONE_BG: Record<SeverityBand["tone"], string> = {
  ok: "#d1fae5",
  mild: "#ecfccb",
  moderate: "#fde68a",
  high: "#fed7aa",
  severe: "#fecaca",
};

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

type Scale = {
  label: string;
  /** Pohimet e shkallës; mungon kur shkalla është i gjithë testi. */
  questionIds?: string[];
  score: number;
  min: number;
  max: number;
  band: SeverityBand;
  bands: SeverityBand[];
};

function scalesOf(test: TestDefinition, result: TestResult): Scale[] {
  if (result.subscales?.length) {
    return result.subscales.map((s) => ({
      label: s.label,
      questionIds: s.questionIds,
      score: s.score,
      min: 0,
      max: s.maxScore,
      band: s.band,
      bands: s.bands,
    }));
  }
  return [
    {
      label: test.code,
      score: result.score,
      min: result.minScore,
      max: result.maxScore,
      band: result.band,
      bands: test.bands,
    },
  ];
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m} min ${s} s` : `${s} s`;
}

const H2 =
  "margin:28px 0 10px;padding:6px 10px;font-size:16px;background:#eef4fb;border-top:1px solid #9bb3cc;border-bottom:1px solid #9bb3cc";
const TD = "padding:6px 10px;border-bottom:1px solid #d6dee6;font-size:13px";
const TH = `${TD};font-weight:600;text-align:left;color:#3d4b59`;

/** Shiriti i një shkalle: intervalet e niveleve me ngjyra dhe, sipër tyre, pika e klientit. */
function scaleChart(s: Scale): string {
  const span = s.max - s.min || 1;
  const pct = Math.max(0, Math.min(100, ((s.score - s.min) / span) * 100));
  const rest = 100 - pct;
  // Gjerësia e çdo intervali, në përqindje të boshtit (kufijtë e njëpasnjëshëm ndahen përgjysmë).
  const widths = s.bands.map((b, i) => {
    const lo = i === 0 ? s.min : (s.bands[i - 1].max + b.min) / 2;
    const hi = i === s.bands.length - 1 ? s.max : (b.max + s.bands[i + 1].min) / 2;
    return ((hi - lo) / span) * 100;
  });
  return `
  <p style="margin:18px 0 6px;font-size:13px;font-weight:600">${esc(s.label)}: ${formatScore(s.score)} nga ${formatScore(s.max)} – ${esc(s.band.level)}</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;table-layout:fixed">
    <tr>
      ${pct > 0 ? `<td width="${pct.toFixed(1)}%" style="height:16px;background:#1f6fb2;border:1px solid #154c7a;font-size:0;line-height:0">&nbsp;</td>` : ""}
      ${rest > 0 ? `<td width="${rest.toFixed(1)}%" style="height:16px;font-size:0;line-height:0">&nbsp;</td>` : ""}
    </tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;table-layout:fixed;margin-top:3px">
    <tr>
      ${s.bands
        .map(
          (b, i) =>
            `<td width="${widths[i].toFixed(1)}%" style="padding:3px 2px;background:${TONE_BG[b.tone]};font-size:10px;line-height:1.2;text-align:center;color:#3d4b59;overflow:hidden">${esc(b.level)}<br>${formatScore(b.min)}–${formatScore(b.max)}</td>`,
        )
        .join("")}
    </tr>
  </table>`;
}

export function buildReportDocument(opts: {
  test: TestDefinition;
  result: TestResult;
  answers: Record<string, number>;
  email: string;
  date: Date;
  durationSec?: number;
  reportUrl: string;
  /** true = faqe më vete për printim; false = trup emaili (me butonin e linkut). */
  standalone?: boolean;
}): string {
  const { test, result, answers, email, date, durationSec, reportUrl, standalone } = opts;
  const brand = config.brandName;
  const scales = scalesOf(test, result);
  const dateText = date.toLocaleDateString("sq-AL", { day: "numeric", month: "long", year: "numeric" });

  const safety =
    result.safetyFlag || result.band.tone === "severe"
      ? `
  <div style="margin:20px 0;padding:14px;border-radius:8px;background:#fff1f2;border:1px solid #fecdd3;color:#881337;font-size:13px">
    <strong>E rëndësishme për sigurinë tuaj</strong>
    <p style="margin:6px 0 8px">${esc(safetyMessage)}</p>
    ${helplines.map((h) => `${esc(h.region)} – ${esc(h.name)}: <strong>${esc(h.number)}</strong>`).join("<br>")}
  </div>`
      : "";

  const P = "margin:0 0 6px;font-size:13px;line-height:1.55";
  const interpretation = scales
    .map((s) => {
      const items = s.band.tone === "ok" ? [] : contributingItems(test, answers, s.questionIds);
      const itemList = items.length
        ? `<p style="margin:0 0 2px;font-size:13px;line-height:1.55">Pohimet që kontribuan më shumë në këtë rezultat:</p>
  <ul style="margin:0 0 6px;padding-left:20px;font-size:13px;line-height:1.5">${items
    .map((i) => `<li>${i.number}. ${esc(i.text)} (${esc(i.answer)})</li>`)
    .join("")}</ul>`
        : "";
      return `
  <p style="margin:12px 0 4px;font-size:13px;font-weight:600">${esc(s.label)}: ${esc(s.band.level)}</p>
  ${s.band.meaning ? `<p style="${P}">${esc(s.band.summary)}</p>` : ""}
  <p style="${P}"><strong>Çka mund të thotë kjo:</strong> ${esc(s.band.meaning ?? s.band.summary)}</p>
  ${itemList}
  <p style="${P}"><strong>Rekomandimi:</strong> ${esc(s.band.recommendation)}</p>`;
    })
    .join("");

  const rangeRows = scales[0].bands
    .map(
      (b, row) => `
    <tr>
      <td style="${TD}">${esc(b.level)}</td>
      ${scales
        .map((s) => {
          const x = s.bands[row];
          const mine = x.level === s.band.level;
          return `<td style="${TD};${mine ? `background:${TONE_BG[x.tone]};font-weight:600` : ""}">${formatScore(x.min)}–${formatScore(x.max)}</td>`;
        })
        .join("")}
    </tr>`,
    )
    .join("");

  const notes = [...(test.scoringNote ?? []), ...(test.interpretationNote ?? [])]
    .map((p) => `<p style="margin:0 0 8px;font-size:13px;line-height:1.55">${esc(p)}</p>`)
    .join("");

  const responses = test.questions
    .map((q, i) => {
      const v = answers[q.id];
      const option = test.options.find((o) => o.value === v);
      return `
    <tr>
      <td style="${TD};width:24px;color:#6b7785">${i + 1}</td>
      <td style="${TD}">${esc(q.text)}</td>
      <td style="${TD};white-space:nowrap">${esc(option?.short ?? option?.label ?? "–")}</td>
      <td style="${TD};width:20px;text-align:right;font-weight:600">${v}</td>
    </tr>`;
    })
    .join("");

  return `<!doctype html>
<html lang="sq"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(brand)} – ${esc(test.title)}</title></head>
<body style="margin:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#1f2933">
<div style="max-width:680px;margin:0 auto;padding:24px 16px">
<div style="background:#ffffff;border:1px solid #d6dee6;padding:24px">
  <p style="margin:0 0 14px;font-size:20px;font-weight:700;color:#0f766e">${esc(brand)}</p>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-top:2px solid #9bb3cc;border-bottom:1px solid #9bb3cc">
    <tr><td colspan="4" style="padding:8px 10px;background:#eef4fb;font-size:16px;font-weight:700;text-align:center">${esc(test.title)}</td></tr>
    <tr>
      <td style="${TH};width:22%">Klienti</td><td style="${TD}">${esc(email)}</td>
      <td style="${TH};width:22%">Data e plotësimit</td><td style="${TD}">${esc(dateText)}</td>
    </tr>
    <tr>
      <td style="${TH}">Instrumenti</td><td style="${TD}">${esc(test.code)}, ${test.questions.length} pohime</td>
      <td style="${TH}">Kohëzgjatja</td><td style="${TD}">${durationSec ? formatDuration(durationSec) : "–"}</td>
    </tr>
  </table>

  <h2 style="${H2}">Rezultatet</h2>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
    <tr><th style="${TH}">Shkalla</th><th style="${TH}">Pikët</th><th style="${TH}">Niveli</th></tr>
    ${scales
      .map(
        (s) => `
    <tr>
      <td style="${TD}">${esc(s.label)} (${formatScore(s.min)}–${formatScore(s.max)})</td>
      <td style="${TD};font-weight:600">${formatScore(s.score)}</td>
      <td style="${TD};background:${TONE_BG[s.band.tone]};font-weight:600">${esc(s.band.level)}</td>
    </tr>`,
      )
      .join("")}
  </table>

  <h2 style="${H2}">Rezultati në raport me nivelet</h2>
  ${scales.map(scaleChart).join("")}
  ${safety}

  <h2 style="${H2}">Interpretimi</h2>
  ${interpretation}
  <p style="margin:14px 0 4px;font-size:13px;font-weight:600">Psikologu dhe psikiatri</p>
  ${professionsNote.map((p) => `<p style="margin:0 0 4px;font-size:13px;line-height:1.55">${esc(p)}</p>`).join("")}

  <h2 style="${H2}">Informacion për pikëzimin dhe interpretimin</h2>
  ${notes}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:6px">
    <tr><th style="${TH}">Niveli</th>${scales.map((s) => `<th style="${TH}">${esc(result.subscales ? s.label : "Pikët")}</th>`).join("")}</tr>
    ${rangeRows}
  </table>

  <h2 style="${H2}">Përgjigjet e klientit</h2>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
    ${responses}
  </table>

  ${
    standalone
      ? ""
      : `<p style="margin:24px 0 8px">
    <a href="${reportUrl}" style="display:inline-block;background:#0f766e;color:#fff;text-decoration:none;padding:11px 18px;border-radius:8px;font-weight:600;font-size:14px">Hap raportin në faqe</a>
  </p>
  <p style="margin:0;font-size:12px;color:#52606d;line-height:1.5">Nga faqja e raportit mund të kërkoni një seancë me psikologun.</p>`
  }

  <p style="margin:22px 0 0;padding-top:12px;border-top:1px solid #d6dee6;font-size:11px;color:#52606d;line-height:1.5">
    Ky raport ka karakter orientues dhe <strong>nuk është diagnozë</strong>. Diagnoza vendoset vetëm nga një psikolog ose psikiatër i licencuar, pas një vlerësimi të plotë klinik.<br>
    Burimi i instrumentit: ${esc(test.source)}<br>
    ${esc(brand)} nuk ruan asnjë të dhënë tuajën; raporti hapet vetëm nga linku që ju ka ardhur në email, që vlen ${config.retentionDays} ditë.
  </p>
</div>
</div></body></html>`;
}

/** Emaili i raportit për klientin: dokumenti i plotë si HTML, plus një version tekst. */
export function buildReportEmail(opts: {
  test: TestDefinition;
  result: TestResult;
  answers: Record<string, number>;
  email: string;
  date: Date;
  durationSec?: number;
  reportUrl: string;
}) {
  const { test, result, reportUrl } = opts;
  const brand = config.brandName;
  const subject = `${brand}: raporti juaj – ${test.title}`;
  const html = buildReportDocument(opts);

  const text = [
    `${brand} – ${test.title}`,
    ``,
    ...(result.subscales?.length
      ? result.subscales.flatMap((s) => [
          `${s.label}: ${formatScore(s.score)} / ${s.maxScore} – ${s.band.level}`,
          `${s.band.summary} ${s.band.recommendation}`,
          ``,
        ])
      : [
          `Rezultati juaj: ${formatScore(result.score)} / ${result.maxScore}`,
          `Niveli: ${result.band.level}`,
          ``,
          result.band.summary,
          ``,
          `Çfarë sugjerohet: ${result.band.recommendation}`,
          ``,
        ]),
    ...(result.safetyFlag || result.band.tone === "severe"
      ? [
          `E RËNDËSISHME: ${safetyMessage}`,
          ...helplines.map((h) => `  ${h.region} – ${h.name}: ${h.number}`),
          ``,
        ]
      : []),
    `Raporti i plotë: ${reportUrl}`,
    ``,
    `Ky raport është vetëvlerësim orientues dhe nuk është diagnozë.`,
  ].join("\n");

  return { subject, html, text };
}

/** Emaili që i shkon psikologut kur klienti kërkon një seancë. */
export function buildSessionRequestEmail(opts: {
  test: TestDefinition;
  result: TestResult;
  clientEmail: string;
  reportUrl: string;
}) {
  const { test, result, clientEmail, reportUrl } = opts;
  const subject = `[${config.brandName}] Kërkesë për seancë – ${test.code}, ${result.subscales?.length ? result.band.level : `${formatScore(result.score)}/${result.maxScore} (${result.band.level})`}`;
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const flag = result.safetyFlag
    ? ` <strong style="color:#b91c1c">(pyetje sinjalizuese aktive)</strong>`
    : "";

  const html = `<!doctype html><html lang="sq"><body style="font-family:Arial,Helvetica,sans-serif;color:#1f2933;line-height:1.55">
  <h2 style="margin:0 0 12px">Një klient kërkon seancë</h2>
  <p>Klienti plotësoi një test në ${config.brandName} dhe kërkoi të caktojë një seancë me ju.</p>
  <p><strong>Testi:</strong> ${test.title}<br>
     <strong>Rezultati:</strong> ${resultLine(result)}${flag}<br>
     <strong>Emaili i klientit:</strong> <a href="mailto:${esc(clientEmail)}">${esc(clientEmail)}</a></p>
  <p style="font-size:13px;color:#52606d">Raporti i plotë: <a href="${reportUrl}">${reportUrl}</a><br>Përgjigjuni direkt këtij emaili për ta kontaktuar klientin dhe caktuar orarin.</p>
  </body></html>`;

  const text = `Një klient kërkon seancë

Testi: ${test.title}
Rezultati: ${resultLine(result)}${result.safetyFlag ? " (pyetje sinjalizuese aktive)" : ""}
Emaili i klientit: ${clientEmail}

Raporti i plotë: ${reportUrl}
Përgjigjuni këtij emaili për ta kontaktuar klientin.`;

  return { subject, html, text };
}

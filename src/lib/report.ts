import { config } from "./config";
import { helplines, safetyMessage } from "./safety";
import { formatScore, resultLine, type TestDefinition, type TestResult } from "./tests";

/**
 * Gjeneron emailin e raportit (HTML + tekst) për klientin.
 * Raporti i plotë ndërveprues jeton te /report/[token]; emaili përmban përmbledhjen
 * dhe linkun, që klienti ta ketë gjithmonë në inbox.
 */
export function buildReportEmail(opts: {
  test: TestDefinition;
  result: TestResult;
  reportUrl: string;
}) {
  const { test, result, reportUrl } = opts;
  const brand = config.brandName;
  const subject = `${brand}: raporti juaj – ${test.title}`;

  const safetyBlock =
    result.safetyFlag || result.band.tone === "severe"
      ? `
      <div style="margin:24px 0;padding:16px;border-radius:12px;background:#fff1f2;border:1px solid #fecdd3;color:#881337">
        <strong>E rëndësishme për sigurinë tuaj</strong>
        <p style="margin:8px 0 12px">${safetyMessage}</p>
        <ul style="margin:0;padding-left:18px">
          ${helplines.map((h) => `<li><strong>${h.region}</strong> – ${h.name}: <strong>${h.number}</strong></li>`).join("")}
        </ul>
      </div>`
      : "";

  const scoreBlock = result.subscales?.length
    ? result.subscales
        .map(
          (s) => `<p style="margin:0 0 4px;font-size:18px;font-weight:600">${s.label}: ${formatScore(s.score)} / ${s.maxScore} – ${s.band.level}</p>
    <p style="margin:0 0 16px;line-height:1.55">${s.band.summary} ${s.band.recommendation}</p>`,
        )
        .join("")
    : `<p style="margin:0 0 4px;font-size:40px;font-weight:700">${formatScore(result.score)}<span style="font-size:18px;color:#7b8794"> / ${result.maxScore}</span></p>
    <p style="margin:0 0 20px;font-size:18px;font-weight:600">Niveli: ${result.band.level}</p>
    <p style="margin:0 0 12px;line-height:1.55">${result.band.summary}</p>
    <p style="margin:0 0 20px;line-height:1.55"><strong>Çfarë sugjerohet:</strong> ${result.band.recommendation}</p>`;

  const html = `<!doctype html>
<html lang="sq"><body style="margin:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#1f2933">
<div style="max-width:560px;margin:0 auto;padding:32px 20px">
  <div style="background:#ffffff;border-radius:16px;padding:28px;border:1px solid #e4e7eb">
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#52606d">${brand}</p>
    <h1 style="margin:0 0 16px;font-size:22px">${test.title}</h1>
    <p style="margin:0 0 8px;color:#52606d">Rezultati juaj</p>
    ${scoreBlock}
    ${safetyBlock}
    <p style="margin:24px 0">
      <a href="${reportUrl}" style="display:inline-block;background:#0f766e;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:600">Hap raportin e plotë</a>
    </p>
    <p style="margin:0;font-size:13px;color:#52606d;line-height:1.5">Nga faqja e raportit mund të kërkoni një seancë me psikologun, nëse doni ta diskutoni rezultatin me një profesionist.</p>
  </div>
  <p style="margin:20px 8px 0;font-size:12px;color:#7b8794;line-height:1.5">
    Ky raport është një vetëvlerësim orientues bazuar në instrumentin ${test.code} dhe <strong>nuk është diagnozë</strong>. Vetëm një profesionist i shëndetit mendor mund të bëjë vlerësim klinik. ${brand} nuk ruan asnjë të dhënë tuajën; raporti hapet vetëm nga linku në këtë email, që vlen ${config.retentionDays} ditë.
  </p>
</div></body></html>`;

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

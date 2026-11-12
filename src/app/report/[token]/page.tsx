import Link from "next/link";
import { Suspense } from "react";
import SessionRequest from "@/components/SessionRequest";
import { config } from "@/lib/config";
import { openReport } from "@/lib/orders";
import { helplines, safetyMessage } from "@/lib/safety";
import { formatScore } from "@/lib/tests";

export const metadata = { title: "Raporti juaj" };

const toneClasses: Record<string, string> = {
  ok: "bg-emerald-50 text-emerald-900 border-emerald-200",
  mild: "bg-lime-50 text-lime-900 border-lime-200",
  moderate: "bg-amber-50 text-amber-900 border-amber-200",
  high: "bg-orange-50 text-orange-900 border-orange-200",
  severe: "bg-rose-50 text-rose-900 border-rose-200",
};

async function Report({ params }: { params: PageProps<"/report/[token]">["params"] }) {
  const { token } = await params;
  const view = openReport(token);

  if (!view) {
    return (
      <div className="flex flex-col items-start gap-4">
        <h1 className="text-2xl font-semibold">Raporti nuk u gjet</h1>
        <p className="leading-relaxed text-muted">
          Linku mund të jetë i gabuar ose i paplotë, ose ka skaduar: linku i raportit vlen{" "}
          {config.retentionDays} ditë.
        </p>
        <Link href="/" className="font-semibold text-accent underline">
          Kthehu te testet
        </Link>
      </div>
    );
  }

  const { test, result, answers, date } = view;
  const showSafety = result.safetyFlag || result.band.tone === "severe";
  const pctOf = (score: number, min: number, max: number) =>
    Math.round(((score - min) / (max - min)) * 100);
  const pct = pctOf(result.score, result.minScore, result.maxScore);

  return (
    <article className="flex flex-col gap-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Raporti juaj</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight">{test.title}</h1>
        <p className="mt-1 text-sm text-muted">
          Plotësuar më{" "}
          {date.toLocaleDateString("sq-AL", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          . Një kopje ju është dërguar në email.
        </p>
      </header>

      {result.subscales ? (
        <section className="grid gap-4 sm:grid-cols-3">
          {result.subscales.map((s) => (
            <div key={s.id} className={`rounded-2xl border p-5 ${toneClasses[s.band.tone]}`}>
              <p className="text-sm font-semibold">{s.label}</p>
              <p className="mt-2 text-4xl font-semibold leading-none">
                {formatScore(s.score)}
                <span className="text-base opacity-60"> / {s.maxScore}</span>
              </p>
              <p className="mt-2 text-lg font-semibold">{s.band.level}</p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full rounded-full bg-current opacity-70"
                  style={{ width: `${pctOf(s.score, 0, s.maxScore)}%` }}
                />
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className={`rounded-2xl border p-6 ${toneClasses[result.band.tone]}`}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm opacity-80">Pikët tuaja</p>
              <p className="text-5xl font-semibold leading-none">
                {formatScore(result.score)}
                <span className="text-xl opacity-60"> / {result.maxScore}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">Niveli</p>
              <p className="text-2xl font-semibold">{result.band.level}</p>
            </div>
          </div>
          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-black/10">
            <div className="h-full rounded-full bg-current opacity-70" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-[11px] opacity-70">
            {test.bands.map((b) => (
              <span key={b.level}>{b.level}</span>
            ))}
          </div>
        </section>
      )}

      {showSafety && (
        <section className="rounded-2xl border border-rose-300 bg-rose-50 p-5 text-rose-950">
          <h2 className="font-semibold">E rëndësishme për sigurinë tuaj</h2>
          <p className="mt-2 text-sm leading-relaxed">{safetyMessage}</p>
          <ul className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
            {helplines.map((h) => (
              <li key={`${h.region}-${h.number}`}>
                <span className="opacity-70">{h.region} · {h.name}:</span>{" "}
                <a href={`tel:${h.number.replace(/\s/g, "")}`} className="font-semibold underline">
                  {h.number}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {result.subscales ? (
        <section className="flex flex-col gap-5">
          <h2 className="text-lg font-semibold">Çfarë do të thotë ky rezultat</h2>
          {result.subscales.map((s) => (
            <div key={s.id} className="flex flex-col gap-1">
              <h3 className="font-semibold">
                {s.label}: {s.band.level}
              </h3>
              <p className="leading-relaxed">{s.band.summary}</p>
              <p className="leading-relaxed text-muted">{s.band.recommendation}</p>
            </div>
          ))}
        </section>
      ) : (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Çfarë do të thotë ky rezultat</h2>
          <p className="leading-relaxed">{result.band.summary}</p>
          <h3 className="mt-2 font-semibold">Çfarë sugjerohet</h3>
          <p className="leading-relaxed">{result.band.recommendation}</p>
        </section>
      )}

      {test.interpretationNote && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Si lexohen këto nivele</h2>
          {test.interpretationNote.map((p) => (
            <p key={p} className="text-sm leading-relaxed text-muted">
              {p}
            </p>
          ))}
        </section>
      )}

      <SessionRequest token={token} />

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Përgjigjet tuaja</h2>
        <ol className="divide-y divide-border rounded-2xl border border-border bg-surface">
          {test.questions.map((q, i) => {
            const v = answers[q.id];
            const option = test.options.find((o) => o.value === v);
            const label = option?.short ?? option?.label ?? "–";
            return (
              <li key={q.id} className="flex items-start justify-between gap-4 p-4 text-sm">
                <span className="leading-relaxed">
                  <span className="mr-2 text-muted">{i + 1}.</span>
                  {q.text}
                </span>
                <span className="shrink-0 rounded-full bg-background px-2.5 py-1 text-xs font-medium">
                  {label} · {v}
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-5 text-xs leading-relaxed text-muted">
        <p>
          <strong className="text-foreground">Ky raport nuk është diagnozë.</strong> {test.code} është
          një instrument orientues (screening instrument) që tregon praninë dhe intensitetin e simptomave,
          jo një vlerësim klinik. Vetëm një profesionist i shëndetit mendor mund të bëjë diagnozë
          dhe plan trajtimi.
        </p>
        <p className="mt-2">
          Burimi i instrumentit: {test.source} {test.license}
        </p>
        <p className="mt-2">
          Privatësia: {config.brandName} nuk ruan asnjë të dhënë tuajën. Raporti hapet vetëm nga ky
          link, që ju ka ardhur edhe në email dhe vlen {config.retentionDays} ditë; mos e ndani me të
          tjerë.
        </p>
      </section>
    </article>
  );
}

export default function ReportPage(props: PageProps<"/report/[token]">) {
  return (
    <Suspense fallback={<p className="text-center text-muted">Po hapet raporti…</p>}>
      <Report params={props.params} />
    </Suspense>
  );
}

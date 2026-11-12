"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { TestDefinition } from "@/lib/tests/types";

/** Pika për shfaqje: numër i plotë, ose dy shifra dhjetore me presje (si te raporti). */
function formatScore(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(".", ",");
}

type Props = {
  test: TestDefinition;
  priceLabel: string;
  brandName: string;
};

/**
 * Rrjedha e plotë e testit në anën e klientit:
 *  intro → pyetje një nga një → email + pëlqim → ridrejtim te pagesa.
 * Përgjigjet qëndrojnë vetëm në memorien e shfletuesit derisa klienti të shtypë "Paguaj".
 */
export default function TestRunner({ test, priceLabel, brandName }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "questions" | "checkout">("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Koha e plotësimit: nga "Fillo testin" deri te përgjigjja e fundit (për raportin).
  const startedAt = useRef<number | null>(null);
  const [durationSec, setDurationSec] = useState<number | undefined>(undefined);

  const total = test.questions.length;
  const question = test.questions[index];
  const answered = Object.keys(answers).length;

  function choose(value: number) {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);
    // Kalo automatikisht te pyetja tjetër pas një pauze të shkurtër, që të shihet zgjedhja.
    window.setTimeout(() => {
      if (index + 1 < total) setIndex(index + 1);
      else {
        if (startedAt.current) setDurationSec(Math.round((Date.now() - startedAt.current) / 1000));
        setStep("checkout");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 180);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testSlug: test.slug, email, answers, consent, durationSec }),
      });
      const data = (await res.json()) as { redirectUrl?: string; error?: string };
      if (!res.ok || !data.redirectUrl) {
        setError(data.error ?? "Diçka shkoi keq. Provoni përsëri.");
        setBusy(false);
        return;
      }
      router.push(data.redirectUrl);
    } catch {
      setError("Nuk u lidhëm dot me serverin. Kontrolloni internetin dhe provoni përsëri.");
      setBusy(false);
    }
  }

  if (step === "intro") {
    // Kolonat e tabelës së shkallëve interpretuese: një për nënshkallë, ose një e vetme.
    const scales = test.subscales?.length
      ? test.subscales.map((sub) => ({ label: sub.label, bands: sub.bands }))
      : [{ label: "Pikët", bands: test.bands }];
    return (
      <div className="flex flex-col gap-6">
        <div>
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
            {test.code}
          </span>
          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight">{test.title}</h1>
          <p className="mt-3 leading-relaxed text-muted">{test.description}</p>
        </div>
        <ul className="grid gap-2 text-sm text-muted sm:grid-cols-3">
          <li className="rounded-xl border border-border bg-surface p-3">
            <strong className="block text-foreground">{total} pyetje</strong>
            rreth {test.minutes} minuta
          </li>
          <li className="rounded-xl border border-border bg-surface p-3">
            <strong className="block text-foreground">{priceLabel}</strong>
            paguani vetëm për raportin
          </li>
          <li className="rounded-xl border border-border bg-surface p-3">
            <strong className="block text-foreground">Anonim</strong>
          </li>
        </ul>
        {test.about?.map((section) => (
          <section key={section.heading} className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">{section.heading}</h2>
            {section.paragraphs.map((p) => (
              <p key={p} className="leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </section>
        ))}
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Pikëzimi dhe shkallët interpretuese</h2>
          {test.scoringNote?.map((p) => (
            <p key={p} className="leading-relaxed text-muted">
              {p}
            </p>
          ))}
          <div className="mt-1 overflow-x-auto rounded-2xl border border-border bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted">
                <tr className="border-b border-border">
                  <th scope="col" className="p-3 font-semibold">
                    Niveli
                  </th>
                  {scales.map((s) => (
                    <th key={s.label} scope="col" className="p-3 font-semibold">
                      {s.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scales[0].bands.map((band, row) => (
                  <tr key={band.level} className="border-b border-border last:border-0">
                    <th scope="row" className="p-3 font-medium">
                      {band.level}
                    </th>
                    {scales.map((s) => (
                      <td key={s.label} className="p-3">
                        {formatScore(s.bands[row].min)}–{formatScore(s.bands[row].max)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <p className="rounded-xl bg-accent-soft p-4 text-sm leading-relaxed text-foreground">
          <strong>Udhëzim:</strong> {test.instruction} Nuk ka përgjigje të sakta apo të gabuara;
          përgjigjuni ashtu si e ndieni, pa u menduar gjatë.
        </p>
        <button
          type="button"
          onClick={() => {
            startedAt.current = Date.now();
            setStep("questions");
          }}
          className="w-full rounded-xl bg-accent px-5 py-3.5 text-base font-semibold text-white transition hover:bg-accent-strong sm:w-auto"
        >
          Fillo testin
        </button>
      </div>
    );
  }

  if (step === "questions") {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center justify-between text-sm text-muted">
            <span>
              Pyetja {index + 1} nga {total}
            </span>
            <span>{test.timeframe}</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${(answered / total) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="min-h-[4.5rem] text-xl font-semibold leading-snug sm:text-2xl">
          {question.text}
        </h2>

        <div className="flex flex-col gap-2.5" role="radiogroup" aria-label={question.text}>
          {test.options.map((o) => {
            const selected = answers[question.id] === o.value;
            return (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => choose(o.value)}
                className={`w-full rounded-xl border px-4 py-3.5 text-left text-base transition ${
                  selected
                    ? "border-accent bg-accent-soft font-semibold"
                    : "border-border bg-surface hover:border-accent"
                }`}
              >
                {o.label}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between text-sm">
          <button
            type="button"
            onClick={() => (index === 0 ? setStep("intro") : setIndex(index - 1))}
            className="text-muted hover:text-foreground"
          >
            ← Prapa
          </button>
          {answers[question.id] !== undefined && index + 1 < total && (
            <button
              type="button"
              onClick={() => setIndex(index + 1)}
              className="font-semibold text-accent"
            >
              Tjetra →
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Hapi i fundit</p>
        <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
          Raporti juaj është gati.
        </h1>
        <p className="mt-2 leading-relaxed text-muted">
          Shkruani emailin ku doni ta merrni. Pas pagesës prej <strong className="text-foreground">{priceLabel}</strong>,
          raporti ju vjen menjëherë, bashkë me një link për ta hapur në çdo kohë.
        </p>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Emaili juaj</span>
        <input
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="emri@shembull.com"
          className="rounded-xl border border-border bg-surface px-4 py-3 text-base outline-none focus:border-accent"
        />
      </label>

      <label className="flex items-start gap-3 text-sm leading-relaxed">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 accent-[var(--accent)]"
        />
        <span>
          Pranoj që përgjigjet dhe emaili im të përpunohen për të gjeneruar raportin, sipas{" "}
          <Link href="/privatesia" target="_blank" className="font-medium text-accent underline">
            politikës së privatësisë
          </Link>
          . E kuptoj që rezultati është orientues dhe nuk është diagnozë.
        </span>
      </label>

      {error && (
        <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-accent px-5 py-3.5 text-base font-semibold text-white transition hover:bg-accent-strong disabled:opacity-60"
        >
          {busy ? "Po ju drejtojmë te pagesa…" : `Paguaj ${priceLabel} dhe merr raportin`}
        </button>
        <button
          type="button"
          onClick={() => {
            setIndex(total - 1);
            setStep("questions");
          }}
          className="text-sm text-muted hover:text-foreground"
        >
          ← Rishiko përgjigjet
        </button>
      </div>

      <p className="text-xs leading-relaxed text-muted">
        Pagesa kryhet te një ofrues i sigurt pagesash; {brandName} nuk e ruan kurrë numrin e kartës
        suaj. Pas dërgimit të raportit nuk ruhet asnjë e dhënë juaja.
      </p>
    </form>
  );
}

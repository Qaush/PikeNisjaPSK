"use client";

import { useState } from "react";

/**
 * Formulari me të cilin klienti i shkruan psikologut nga faqja e raportit.
 * Mesazhi shkon përmes serverit (/api/contact), që adresa e psikologut të mos ekspozohet.
 */
export default function ContactForm({ token }: { token: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, message }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Diçka shkoi keq.");
        setState("error");
        return;
      }
      setState("sent");
    } catch {
      setError("Nuk u lidhëm dot me serverin. Provoni përsëri.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-2xl border border-border bg-accent-soft p-5">
        <h3 className="font-semibold">Mesazhi u dërgua.</h3>
        <p className="mt-1 text-sm leading-relaxed">
          Psikologu do t&apos;ju përgjigjet në emailin me të cilin morët raportin, zakonisht brenda
          1–2 ditëve të punës.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="text-lg font-semibold">Doni të bisedoni për rezultatin?</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        Mund t&apos;i shkruani direkt psikologut. Mesazhi juaj dhe rezultati i testit i dërgohen
        konfidencialisht, dhe përgjigjja ju vjen në email.
      </p>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong"
        >
          Kontakto psikologun
        </button>
      ) : (
        <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Mesazhi juaj</span>
            <textarea
              required
              minLength={5}
              maxLength={3000}
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Përshkruani shkurt çfarë ju shqetëson ose çfarë doni të pyesni…"
              className="rounded-xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-accent"
            />
          </label>
          {error && (
            <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </p>
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={state === "busy"}
              className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong disabled:opacity-60"
            >
              {state === "busy" ? "Po dërgohet…" : "Dërgo mesazhin"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm text-muted hover:text-foreground"
            >
              Anulo
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

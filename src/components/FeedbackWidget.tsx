"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Kutia e kërkesave për ndryshim, e dukshme vetëm për rishikuesin (psikologun) që ka hyrë
 * me linkun e vet. Kërkesa ruhet te serveri dhe gjendja e saj (e re / në punë / u krye)
 * shfaqet këtu, bashkë me përgjigjen e zhvilluesit.
 */

type Item = {
  id: string;
  createdAt: string;
  page: string;
  text: string;
  status: "e-re" | "ne-pune" | "kryer" | "pyetje";
  reply?: string;
};

const STATUS: Record<Item["status"], { label: string; cls: string }> = {
  "e-re": { label: "E re", cls: "bg-border text-foreground" },
  "ne-pune": { label: "Në punë", cls: "bg-amber-200 text-amber-900" },
  kryer: { label: "U krye", cls: "bg-accent text-white" },
  pyetje: { label: "Pyetje për ju", cls: "bg-red-200 text-red-900" },
};

export default function FeedbackWidget() {
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/feedback", { cache: "no-store" });
      const data = (await res.json()) as { enabled: boolean; items?: Item[] };
      setEnabled(data.enabled);
      if (data.items) setItems(data.items);
    } catch {
      // Pa rrjet: lihet gjendja e fundit.
    }
  }, []);

  useEffect(() => {
    const first = setTimeout(load, 0);
    const timer = setInterval(load, 20000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [load]);

  if (!enabled) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, page: window.location.pathname }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Diçka shkoi keq.");
        return;
      }
      setText("");
      await load();
    } catch {
      setError("Nuk u lidhëm dot me serverin. Provoni përsëri.");
    } finally {
      setBusy(false);
    }
  }

  const openCount = items.filter((i) => i.status !== "kryer").length;

  return (
    <div className="fixed bottom-4 right-4 z-20 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2">
      {open && (
        <div className="flex max-h-[75vh] w-96 max-w-full flex-col rounded-2xl border border-border bg-surface shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Kërkesat për ndryshim</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Mbyll"
              className="text-muted hover:text-foreground"
            >
              ✕
            </button>
          </div>
          <form onSubmit={submit} className="border-b border-border p-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              maxLength={2000}
              placeholder="Çka duhet ndryshuar në këtë faqe? P.sh. «Pyetja 3 te ankthi: zëvendëso … me …»"
              className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-accent"
            />
            {error && (
              <p role="alert" className="mt-2 text-sm text-red-700">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy || text.trim().length < 3}
              className="mt-2 w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-strong disabled:opacity-60"
            >
              {busy ? "Po dërgohet…" : "Dërgo kërkesën"}
            </button>
            <p className="mt-2 text-xs text-muted">
              Shkruani një ndryshim për kërkesë. Faqja ku jeni ruhet vetë.
            </p>
          </form>
          <ul className="flex-1 space-y-3 overflow-y-auto p-4">
            {items.length === 0 && <li className="text-sm text-muted">Ende asnjë kërkesë.</li>}
            {items.map((i) => (
              <li key={i.id} className="rounded-xl border border-border p-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS[i.status].cls}`}>
                    {STATUS[i.status].label}
                  </span>
                  <span className="truncate text-xs text-muted">{i.page}</span>
                </div>
                <p className="mt-2 whitespace-pre-wrap leading-relaxed">{i.text}</p>
                {i.reply && (
                  <p className="mt-2 whitespace-pre-wrap rounded-lg bg-accent-soft p-2 leading-relaxed">
                    {i.reply}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-accent-strong"
      >
        Kërkesë për ndryshim{openCount > 0 ? ` (${openCount})` : ""}
      </button>
    </div>
  );
}

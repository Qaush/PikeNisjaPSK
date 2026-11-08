"use client";

import { useState } from "react";

/**
 * Kërkesë për seancë me psikologun, me një klikim.
 * Nuk ka tekst të lirë: klienti vetëm shpreh dëshirën për seancë, dhe psikologu
 * merr emailin e tij bashkë me rezultatin e testit, për ta kontaktuar.
 */
export default function SessionRequest({
  token,
  alreadyRequested,
}: {
  token: string;
  alreadyRequested: boolean;
}) {
  const [state, setState] = useState<"idle" | "busy" | "sent" | "error">(
    alreadyRequested ? "sent" : "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function request() {
    setState("busy");
    setError(null);
    try {
      const res = await fetch("/api/session-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
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
        <h3 className="font-semibold">Kërkesa juaj u dërgua.</h3>
        <p className="mt-1 text-sm leading-relaxed">
          Psikologu e ka marrë kërkesën tuaj bashkë me rezultatin e testit dhe do t&apos;ju
          kontaktojë në emailin tuaj për të caktuar seancën.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <h3 className="text-lg font-semibold">Doni një seancë me psikologun?</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        Nëse rezultati ju shqetëson dhe doni ta diskutoni me një profesionist, mund të kërkoni
        një seancë. Psikologut i dërgohen emaili juaj dhe ky rezultat, dhe ai ju kontakton për
        orarin. Asgjë tjetër nuk kërkohet.
      </p>
      {error && (
        <p role="alert" className="mt-3 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={request}
        disabled={state === "busy"}
        className="mt-4 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong disabled:opacity-60"
      >
        {state === "busy" ? "Po dërgohet…" : "Kërko një seancë"}
      </button>
    </div>
  );
}

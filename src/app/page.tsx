import Link from "next/link";
import { config, formatPrice } from "@/lib/config";
import { TESTS } from "@/lib/tests";

/**
 * Faqja fillestare. Teksti hyrës, blloku "Rreth faqes" dhe njoftimi i urgjencës janë sipas
 * kërkesave 1FFgPTDv dhe 5_MOzbLH të psikologes (11.11.2026): gjuhë akademike, pa formulime reklamuese.
 */
export default function Home() {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          Teste psikologjike
        </p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          Vlerësim orientues i shqetësimeve psikologjike
        </h1>
        <p className="text-base leading-relaxed text-muted sm:text-lg">
          {config.brandName} është krijuar për t&apos;ju ofruar një hapësirë të sigurt ku mund të
          vlerësoni shqetësimet tuaja psikologjike përmes testeve të vlefshme dhe të besueshme.
          Testet në këtë faqe përdoren gjerësisht në fushën e psikologjisë, si nga klinicistët
          ashtu edhe nga hulumtuesit.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Zgjidhni testin</h2>
        <ul className="grid gap-4 sm:grid-cols-2">
          {TESTS.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/test/${t.slug}`}
                className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-surface p-5 transition hover:border-accent hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
                    {t.code}
                  </span>
                  <span className="text-xs text-muted">
                    {t.questions.length} pyetje · ~{t.minutes} min
                  </span>
                </div>
                <h3 className="text-lg font-semibold leading-snug">{t.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{t.tagline}</p>
                <span className="mt-auto text-sm font-semibold text-accent group-hover:underline">
                  Fillo testin →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Rreth faqes</h2>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="font-semibold">Kush e ka krijuar</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Faqja është krijuar nga një e diplomuar në psikologji klinike (MSc).
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="font-semibold">Karakteri i rezultateve</h3>
          <div className="mt-2 flex flex-col gap-3 text-sm leading-relaxed text-muted">
            <p>
              Rezultatet kanë karakter orientues dhe nuk përbëjnë diagnozë. Testimi në{" "}
              {config.brandName} nuk mund të përcaktojë nëse keni një çrregullim psikologjik. Ai
              tregon vetëm shkallën e simptomave që keni raportuar në një moment të caktuar. Një
              pikëzim i lartë nuk do të thotë se keni një çrregullim, ndërsa një pikëzim i ulët nuk
              do të thotë se gjithçka është në rregull.
            </p>
            <p>
              Diagnoza vendoset vetëm pas një vlerësimi të plotë klinik, që përfshin takime me një
              psikolog ose psikiatër të licencuar, i cili merr parasysh historikun tuaj, simptomat,
              kontekstin e jetës suaj dhe, kur nevojitet, edhe teste të tjera. Rezultatet e{" "}
              {config.brandName} nuk duhet të përdoren si zëvendësim i këtij vlerësimi, as për të
              filluar ose ndërprerë trajtim.
            </p>
            <p>
              Nëse rezultati ju shqetëson ose simptomat ndikojnë në jetën tuaj të përditshme, ju
              inkurajojmë të kërkoni ndihmë nga një profesionist i shëndetit mendor.
            </p>
          </div>
        </div>
        <p
          role="note"
          className="rounded-2xl border border-rose-300 bg-rose-50 p-4 text-sm leading-relaxed text-rose-950"
        >
          Nëse jeni në rrezik të menjëhershëm, telefononi urgjencën:{" "}
          <a href="tel:112" className="font-semibold underline">
            112
          </a>
          .
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Si zhvillohet vlerësimi</h2>
        <div className="grid gap-4 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-3">
          {[
            ["1", "Plotësimi", "Përgjigjeni në mënyrë anonime, pa emër dhe pa llogari."],
            ["2", "Raporti", `Pas pagesës prej ${formatPrice()}, raporti ju dërgohet në email.`],
            ["3", "Seanca", "Nga raporti mund të kërkoni një seancë me psikologun."],
          ].map(([n, title, body]) => (
            <div key={n} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
                {n}
              </span>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted">{body}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-muted">
          Instrumentet e përdorura: {TESTS.map((t) => t.code).join(", ")}, me përkthim në shqip.
          Pas dërgimit të raportit, {config.brandName} nuk ruan asnjë të dhënë tuajën.
        </p>
      </section>
    </div>
  );
}

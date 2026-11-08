import Link from "next/link";
import { config, formatPrice } from "@/lib/config";
import { TESTS } from "@/lib/tests";

export default function Home() {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">
          Teste psikologjike vetëvlerësuese
        </p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          Kuptoni si jeni, në më pak se 5 minuta.
        </h1>
        <p className="text-base leading-relaxed text-muted sm:text-lg">
          Teste të shkurtra, të validuara shkencërisht, që përdoren nga psikologët në gjithë
          botën. Përgjigjuni anonimisht, dhe raportin e detajuar e merrni në email për{" "}
          <strong className="text-foreground">{formatPrice()}</strong>.
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
          <li>✓ Pa regjistrim</li>
          <li>✓ Të dhëna të enkriptuara</li>
          <li>✓ Mundësi kontakti me psikolog</li>
        </ul>
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

      <section className="grid gap-4 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-3">
        {[
          ["1", "Përgjigjuni", "Pyetje të shkurtra për dy javët e fundit. Pa emër, pa llogari."],
          ["2", "Merrni raportin", `Pas pagesës prej ${formatPrice()}, raporti ju vjen menjëherë në email.`],
          ["3", "Flisni me dikë", "Nëse doni, i shkruani psikologut direkt nga raporti."],
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
      </section>

      <p className="text-sm leading-relaxed text-muted">
        {config.brandName} përdor instrumente të lira për përdorim publik (GAD-7, PHQ-9), me
        përkthim në shqip. Rezultatet janë orientuese dhe nuk zëvendësojnë vlerësimin e një
        profesionisti.
      </p>
    </div>
  );
}

import { config } from "@/lib/config";

export const metadata = { title: "Politika e privatësisë" };

export default function PrivacyPage() {
  return (
    <article className="prose-sm flex max-w-none flex-col gap-5 leading-relaxed">
      <h1 className="text-3xl font-semibold tracking-tight">Politika e privatësisë</h1>
      <p className="text-sm text-muted">Draft pune. Duhet rishikuar nga një jurist para publikimit.</p>

      <h2 className="text-lg font-semibold">Çfarë të dhënash mbledhim</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li><strong>Përgjigjet e testit</strong>: numrat 0–3 për çdo pyetje, pa emrin tuaj.</li>
        <li><strong>Emaili juaj</strong>: vetëm për t&apos;ju dërguar raportin dhe, nëse e kërkoni ju, që psikologu t&apos;ju kontaktojë për një seancë.</li>
        <li><strong>Të dhënat e pagesës</strong>: përpunohen tërësisht nga ofruesi i pagesës. {config.brandName} nuk e sheh dhe nuk e ruan kurrë numrin e kartës suaj.</li>
      </ul>
      <p>Nuk kërkojmë emër, numër telefoni, datëlindje apo llogari përdoruesi.</p>

      <h2 className="text-lg font-semibold">Si i mbrojmë</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>{config.brandName} nuk ruan asnjë të dhënë tuajën.</strong> Pasi t&apos;ju dërgohet raporti,
          te ne nuk mbeten as përgjigjet, as emaili juaj.
        </li>
        <li>
          Gjatë pagesës, përgjigjet dhe emaili mbahen të enkriptuara vetëm sa për të përgatitur raportin dhe
          fshihen sapo ai dërgohet (ose brenda {config.pendingOrderHours} orësh, nëse pagesa nuk kryhet).
        </li>
        <li>
          Raporti hapet vetëm nga linku që ju vjen në email. Linku vlen {config.retentionDays} ditë; mos e
          ndani me të tjerë.
        </li>
      </ul>

      <h2 className="text-lg font-semibold">Baza ligjore dhe të drejtat tuaja</h2>
      <p>
        Të dhënat për shëndetin janë kategori e veçantë. I përpunojmë vetëm me <strong>pëlqimin tuaj të shprehur</strong>,
        që e jepni para pagesës. Meqë pas dërgimit të raportit nuk ruajmë asgjë, te ne nuk ka të dhëna për t&apos;u
        fshirë; raporti mbetet vetëm në emailin tuaj.
      </p>

      <h2 className="text-lg font-semibold">Kërkesa për seancë</h2>
      <p>
        Nëse kërkoni një seancë nga raporti, emaili juaj dhe rezultati i testit i dërgohen psikologut, që
        t&apos;ju kontaktojë për të caktuar orarin. Asgjë tjetër nuk i dërgohet. Ky komunikim është konfidencial.
      </p>

      <h2 className="text-lg font-semibold">Kontakt</h2>
      <p>Për çdo pyetje mbi privatësinë: [email i kontaktit, plotësohet para publikimit].</p>
    </article>
  );
}

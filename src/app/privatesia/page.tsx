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
        <li>Emaili dhe përgjigjet ruhen <strong>të enkriptuara</strong> (AES-256) në server.</li>
        <li>Raporti hapet vetëm me një link sekret që ju vjen në email.</li>
        <li>Të dhënat <strong>fshihen automatikisht pas {config.retentionDays} ditësh</strong>.</li>
        <li>Nuk i shesim, nuk i ndajmë me palë të treta për marketing dhe nuk i përdorim për reklama.</li>
      </ul>

      <h2 className="text-lg font-semibold">Baza ligjore dhe të drejtat tuaja</h2>
      <p>
        Të dhënat për shëndetin janë kategori e veçantë. I përpunojmë vetëm me <strong>pëlqimin tuaj të shprehur</strong>,
        që e jepni para pagesës. Mund ta tërhiqni pëlqimin dhe të kërkoni fshirjen e menjëhershme të të dhënave
        duke na shkruar; do t&apos;i fshijmë brenda 72 orëve.
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

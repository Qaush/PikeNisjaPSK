import { config, formatPrice } from "@/lib/config";

export const metadata = { title: "Kushtet e përdorimit" };

export default function TermsPage() {
  return (
    <article className="flex flex-col gap-5 leading-relaxed">
      <h1 className="text-3xl font-semibold tracking-tight">Kushtet e përdorimit</h1>
      <p className="text-sm text-muted">Draft pune. Duhet rishikuar nga një jurist para publikimit.</p>

      <h2 className="text-lg font-semibold">1. Çfarë ofron {config.brandName}</h2>
      <p>
        {config.brandName} ofron teste psikologjike vetëvlerësuese (screening) të bazuara në instrumente
        të validuara shkencërisht, dhe një raport të automatizuar me rezultatin tuaj. Shërbimi është
        informues dhe orientues.
      </p>

      <h2 className="text-lg font-semibold">2. Nuk është diagnozë dhe nuk zëvendëson mjekun</h2>
      <p>
        Rezultatet <strong>nuk përbëjnë diagnozë, këshillë mjekësore apo trajtim</strong>. Vetëm një
        profesionist i licencuar i shëndetit mendor mund të bëjë vlerësim klinik. Nëse jeni në rrezik të
        menjëhershëm, telefononi urgjencën.
      </p>

      <h2 className="text-lg font-semibold">3. Pagesa</h2>
      <p>
        Çmimi i një raporti është {formatPrice()}, me TVSH të përfshirë ku aplikohet. Pagesa kryhet përmes
        një ofruesi të sigurt pagesash. Meqë raporti dorëzohet menjëherë pas pagesës, nuk ofrohet rimbursim,
        përveç rasteve kur raporti nuk ju është dorëzuar për shkak të një gabimi teknik nga ana jonë.
      </p>

      <h2 className="text-lg font-semibold">4. Mosha</h2>
      <p>Shërbimi është për persona mbi 18 vjeç. Për të mitur, kërkohet pëlqimi i prindit ose kujdestarit.</p>

      <h2 className="text-lg font-semibold">5. Kërkesa për seancë</h2>
      <p>
        Kërkesa për seancë është një shprehje interesi dhe nuk krijon automatikisht marrëdhënie
        terapeutike. Psikologu ju kontakton për orarin, kushtet dhe çmimin e seancës, që janë të ndara
        nga çmimi i raportit.
      </p>
    </article>
  );
}

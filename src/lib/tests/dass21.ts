import type { SeverityBand, TestDefinition } from "./types";

/**
 * DASS-21 — Depression Anxiety Stress Scales, versioni i shkurtër me 21 pohime.
 * Lovibond, S. H., & Lovibond, P. F. (1995). Manual for the Depression Anxiety Stress Scales
 * (2nd ed.). Sydney: Psychology Foundation. Faqja zyrtare: https://dass.psy.unsw.edu.au/
 *
 * Burimet (kërkesa v14PYyej e psikologes, 12.11.2026):
 *  - Pohimet: teksti anglisht i formularit DASS-21 (i njëjtë në PDF-në që dërgoi psikologia
 *    dhe në formularin zyrtar), i përkthyer në shqip për këtë faqe. Përkthimi i publikuar në
 *    faqen zyrtare (Basha & Kaya) u provua më parë dhe u hoq: kishte gabime drejtshkrimi dhe
 *    shkallë përgjigjesh të ndryshme nga origjinali.
 *  - Udhëzimi dhe shkalla e përgjigjeve: sipas formularit zyrtar të autorëve (katër
 *    përshkrimet, pa fjalët KURRË/NGANJËHERË/SHPESH të PDF-së së Black Dog Institute).
 *  - Pikëzimi: sipas autorëve origjinalë. Shuma e 7 pohimeve të secilës shkallë shumëzohet
 *    me 2 (FAQ e faqes zyrtare) dhe krahasohet me pragjet e manualit.
 *
 * Përkthimi duhet rishikuar nga psikologu.
 *
 * KUJDES – kushtet e autorëve (FAQ 9 dhe 21 të faqes zyrtare): DASS nuk duhet administruar në
 * faqe të hapura për publikun dhe pikët e llogaritura nuk duhet t'i shfaqen plotësuesit.
 * Psikologia u njoftua për këtë para se testi të kthehej dhe kërkoi të shtohet. DASS është në
 * domenin publik, pra kufizimi është kusht i autorëve, jo çështje e së drejtës së autorit.
 *
 * DASS nuk ka pohim për vetëlëndim; mesazhi i sigurisë shfaqet te niveli më i rëndë.
 */

type Cutoffs = [normal: number, mild: number, moderate: number, severe: number];

/** Ndërton 5 nivelet e manualit për një shkallë (pikët tashmë të shumëzuara me 2, 0–42). */
function bands(what: string, cut: Cutoffs): SeverityBand[] {
  const [normal, mild, moderate, severe] = cut;
  return [
    {
      min: 0,
      max: normal,
      level: "Normal",
      tone: "ok",
      summary: `Rezultati juaj për ${what} është brenda kufijve normalë për javën e fundit.`,
      recommendation:
        "Nuk ka tregues për shqetësim në këtë moment. Testi mund të përsëritet pas disa javësh, sidomos pas një periudhe të ngarkuar.",
    },
    {
      min: normal + 1,
      max: mild,
      level: "I lehtë",
      tone: "mild",
      summary: `Rezultati juaj për ${what} është mbi mesataren e popullatës, por ka gjasa të jetë ende shumë nën nivelin tipik të personave që kërkojnë ndihmë. «I lehtë» nuk do të thotë nivel i lehtë i një çrregullimi.`,
      recommendation:
        "Vëzhgojeni gjendjen në javët në vijim. Nëse simptomat vazhdojnë ose ju pengojnë në përditshmëri, bisedoni me një profesionist të shëndetit mendor.",
    },
    {
      min: mild + 1,
      max: moderate,
      level: "I moderuar",
      tone: "moderate",
      summary: `Rezultati juaj tregon nivel të moderuar për ${what}, dukshëm mbi mesataren e popullatës.`,
      recommendation:
        "Rekomandohet një vlerësim psikologjik nga një psikolog.",
    },
    {
      min: moderate + 1,
      max: severe,
      level: "I rëndë",
      tone: "high",
      summary: `Rezultati juaj tregon nivel të rëndë për ${what}.`,
      recommendation:
        "Ju rekomandojmë të kontaktoni sa më shpejt një psikolog për vlerësim psikologjik dhe psikoterapi, dhe një psikiatër për të vlerësuar nëse nevojitet edhe trajtim me barna.",
    },
    {
      min: severe + 1,
      max: 42,
      level: "Jashtëzakonisht i rëndë",
      tone: "severe",
      summary: `Rezultati juaj tregon nivel jashtëzakonisht të rëndë për ${what}.`,
      recommendation:
        "Ju rekomandojmë fuqimisht të kërkoni ndihmë profesionale pa vonesë: një psikiatër për vlerësim mjekësor dhe një psikolog për mbështetje psikoterapeutike.",
    },
  ];
}

export const dass21: TestDefinition = {
  slug: "dass21",
  code: "DASS-21",
  title: "Depresioni, ankthi dhe stresi (DASS-21)",
  tagline: "Tri matje në një test: depresioni, ankthi dhe stresi gjatë javës së fundit.",
  description:
    "DASS-21 (Lovibond & Lovibond, 1995) mat veçmas tri gjendje emocionale: depresionin, ankthin dhe stresin. Përbëhet nga 21 pohime të shkurtra dhe zgjat rreth 5 minuta.",
  instruction:
    "Lexoni secilin pohim dhe zgjidhni numrin 0, 1, 2 ose 3 që tregon sa ka vlejtur pohimi për ju gjatë javës së fundit. Mos kaloni shumë kohë në asnjë pohim.",
  timeframe: "java e fundit",
  minutes: 5,
  options: [
    { value: 0, label: "Nuk vlen aspak për mua", short: "Aspak" },
    { value: 1, label: "Vlen për mua deri diku, ose herë pas here", short: "Deri diku" },
    {
      value: 2,
      label: "Vlen për mua në masë të konsiderueshme, ose një pjesë të mirë të kohës",
      short: "Në masë të konsiderueshme",
    },
    { value: 3, label: "Vlen shumë për mua, ose shumicën e kohës", short: "Shumë" },
  ],
  questions: [
    { id: "q1", text: "E kam pasur të vështirë të qetësohem." },
    { id: "q2", text: "Kam vënë re tharje të gojës." },
    { id: "q3", text: "Më dukej se nuk mund të përjetoja asnjë ndjenjë pozitive." },
    {
      id: "q4",
      text: "Kam pasur vështirësi në frymëmarrje (p.sh. frymëmarrje tepër të shpejtë, mungesë fryme pa bërë përpjekje fizike).",
    },
    { id: "q5", text: "E kam pasur të vështirë të gjej nismën për të bërë gjëra." },
    { id: "q6", text: "Kam pasur prirje të reagoj në mënyrë të tepruar ndaj situatave." },
    { id: "q7", text: "Kam pasur dridhje (p.sh. në duar)." },
    { id: "q8", text: "Kam ndier se po harxhoja shumë energji nervore." },
    {
      id: "q9",
      text: "Jam shqetësuar për situata në të cilat mund të më kapte paniku dhe të bëhesha qesharak/e.",
    },
    { id: "q10", text: "Kam ndier se nuk kisha asgjë për të pritur me padurim." },
    { id: "q11", text: "E kam vënë re se po bëhesha i/e trazuar." },
    { id: "q12", text: "E kam pasur të vështirë të relaksohem." },
    { id: "q13", text: "Jam ndier i/e dëshpëruar dhe i/e trishtuar." },
    {
      id: "q14",
      text: "Nuk kam toleruar asgjë që më pengonte të vazhdoja me atë që po bëja.",
    },
    { id: "q15", text: "Kam ndier se isha afër panikut." },
    { id: "q16", text: "Nuk kam mundur të entuziazmohem për asgjë." },
    { id: "q17", text: "Kam ndier se nuk vlej shumë si person." },
    { id: "q18", text: "Kam ndier se isha mjaft i/e prekshëm/e." },
    {
      id: "q19",
      text: "I kam ndier rrahjet e zemrës pa bërë përpjekje fizike (p.sh. ndjesi e shpejtimit të rrahjeve, kapërcim i një rrahjeje).",
    },
    { id: "q20", text: "Jam ndier i/e frikësuar pa ndonjë arsye të mirë." },
    { id: "q21", text: "Kam ndier se jeta ishte e pakuptimtë." },
  ],
  multiplier: 2,
  bands: [],
  subscales: [
    {
      id: "depresioni",
      label: "Depresioni",
      questionIds: ["q3", "q5", "q10", "q13", "q16", "q17", "q21"],
      bands: bands("depresionin", [9, 13, 20, 27]),
    },
    {
      id: "ankthi",
      label: "Ankthi",
      questionIds: ["q2", "q4", "q7", "q9", "q15", "q19", "q20"],
      bands: bands("ankthin", [7, 9, 14, 19]),
    },
    {
      id: "stresi",
      label: "Stresi",
      questionIds: ["q1", "q6", "q8", "q11", "q12", "q14", "q18"],
      bands: bands("stresin", [14, 18, 25, 33]),
    },
  ],
  about: [
    {
      heading: "Çfarë është DASS-21",
      paragraphs: [
        "DASS-21 (Depression Anxiety Stress Scales) është versioni i shkurtër, me 21 pohime, i shkallëve të zhvilluara nga S. H. Lovibond dhe P. F. Lovibond (1995) në Universitetin e New South Wales. Përbëhet nga tri shkallë me nga 7 pohime: depresioni, ankthi dhe stresi.",
        "Shkalla e depresionit vlerëson humorin e dëshpëruar, mungesën e shpresës, zhvlerësimin e vetes dhe humbjen e interesit. Shkalla e ankthit vlerëson zgjimin fiziologjik, ankthin e lidhur me situata dhe përjetimin subjektiv të frikës. Shkalla e stresit vlerëson vështirësinë për t'u relaksuar, tensionin nervor, irritimin dhe padurimin.",
      ],
    },
    {
      heading: "Për çka shërben",
      paragraphs: [
        "DASS mat ashpërsinë e simptomave kryesore të depresionit, ankthit dhe stresit gjatë javës së fundit. Përdoret në praktikën klinike dhe në hulumtim për të vlerësuar gjendjen emocionale dhe për të ndjekur ndryshimin e saj me kalimin e kohës.",
        "DASS bazohet në një konceptim dimensional, jo kategorik, të shqetësimit psikologjik: dallimet mes njerëzve shihen si dallime në shkallë, jo si prani ose mungesë e një çrregullimi.",
      ],
    },
    {
      heading: "Kufizimet",
      paragraphs: [
        "DASS nuk është instrument diagnostikues dhe rezultatet e tij nuk përcaktojnë një diagnozë. Sipas autorëve, vendimet e bazuara në rezultate duhet të merren vetëm nga klinicistë me përvojë, së bashku me të gjithë informacionin klinik. Diagnoza vendoset vetëm nga një psikolog ose psikiatër i licencuar, pas një vlerësimi të plotë.",
      ],
    },
    {
      heading: "Autorët",
      paragraphs: [
        "Lovibond, S. H., & Lovibond, P. F. (1995). Manual for the Depression Anxiety Stress Scales (2nd ed.). Sydney: Psychology Foundation.",
      ],
    },
  ],
  interpretationNote: [
    "Pikëzimi dhe nivelet e ashpërsisë janë sipas Lovibond & Lovibond (1995): shuma e secilës shkallë shumëzohet me 2. DASS është matje sasiore e shqetësimit përgjatë tri boshteve: depresionit, ankthit dhe stresit. Nuk është matje kategorike e diagnozave klinike.",
    "Gjendjet emocionale si depresioni dhe ankthi janë dimensionale: ato ndryshojnë përgjatë një vazhdimësie të ashpërsisë. Për këtë arsye, çdo prag i vetëm për të përcaktuar ashpërsinë klinike është domosdoshmërisht arbitrar.",
    "Emërtimet e niveleve përshkruajnë ku bie rezultati në raport me popullatën. «I lehtë», për shembull, do të thotë se personi është mbi mesataren e popullatës, por ende shumë nën ashpërsinë tipike të personave që kërkojnë ndihmë; nuk do të thotë nivel i lehtë i një çrregullimi.",
    "Rezultatet e DASS nuk përcaktojnë vetë ndërhyrjen e duhur. Ato duhen përdorur së bashku me të gjithë informacionin klinik, nga një profesionist i shëndetit mendor.",
  ],
  scoringNote: [
    "Secili nga 21 pohimet pikëzohet nga 0 deri në 3. Për secilën shkallë mblidhen 7 pohimet përkatëse dhe shuma shumëzohet me 2, kështu që rezultati i çdo shkalle shkon nga 0 deri në 42 (Lovibond & Lovibond, 1995).",
    "Depresioni: pohimet 3, 5, 10, 13, 16, 17 dhe 21. Ankthi: pohimet 2, 4, 7, 9, 15, 19 dhe 20. Stresi: pohimet 1, 6, 8, 11, 12, 14 dhe 18.",
  ],
  source:
    "Lovibond, S. H., & Lovibond, P. F. (1995). Manual for the Depression Anxiety Stress Scales (2nd ed.). Sydney: Psychology Foundation.",
  license: "Në domenin publik; përdoret pa leje.",
};

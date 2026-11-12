import type { SeverityBand, TestDefinition } from "./types";

/**
 * DASS-21 — Depression Anxiety Stress Scales, versioni i shkurtër me 21 pohime.
 * Lovibond, S. H., & Lovibond, P. F. (1995). Manual for the Depression Anxiety Stress Scales
 * (2nd ed.). Sydney: Psychology Foundation. Faqja zyrtare: https://dass.psy.unsw.edu.au/
 *
 * Ky version ndjek faqen zyrtare të autorëve (kërkesat dOGN-lYp dhe OtPn4AAJ të psikologes,
 * 12.11.2026), jo PDF-në e Black Dog Institute që ishte përdorur më parë:
 *  - Pohimet dhe shkalla e përgjigjeve: përkthimi shqip i publikuar në faqen zyrtare, nga
 *    Dr. Ertan Basha dhe Mehmet Kaya (Sakarya University). Janë marrë FJALË PËR FJALË, me
 *    drejtshkrimin e origjinalit, sepse autorët nuk lejojnë modifikimin e shkallëve. Faqja
 *    zyrtare nuk jep garanci për vlefshmërinë e përkthimeve.
 *  - Pikëzimi: shuma e 7 pohimeve të secilës shkallë shumëzohet me 2 (FAQ e faqes zyrtare),
 *    dhe krahasohet me pragjet e manualit.
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
        "Rekomandohet një bisedë me psikolog ose psikiatër për një vlerësim më të plotë.",
    },
    {
      min: moderate + 1,
      max: severe,
      level: "I rëndë",
      tone: "high",
      summary: `Rezultati juaj tregon nivel të rëndë për ${what}.`,
      recommendation:
        "Ju rekomandojmë të kontaktoni sa më shpejt një psikolog ose psikiatër për një vlerësim të plotë klinik.",
    },
    {
      min: severe + 1,
      max: 42,
      level: "Jashtëzakonisht i rëndë",
      tone: "severe",
      summary: `Rezultati juaj tregon nivel jashtëzakonisht të rëndë për ${what}.`,
      recommendation:
        "Ju rekomandojmë fuqimisht të kërkoni ndihmë profesionale pa vonesë. Një psikolog ose psikiatër mund t'ju ndihmojë.",
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
    "Për secilin pohim zgjidhni përgjigjen që ju përshtatet më së shumti për javën e fundit. Jepni vetëm një përgjigje për secilin pohim.",
  timeframe: "java e fundit",
  minutes: 5,
  options: [
    { value: 0, label: "Aspak nuk pajtohem" },
    { value: 1, label: "Nuk pajtohem" },
    { value: 2, label: "Pajtohem" },
    { value: 3, label: "Gjithsesi pajtohem" },
  ],
  // Pohimet: përkthimi i Basha & Kaya nga faqja zyrtare, i pandryshuar (shih komentin në krye).
  questions: [
    { id: "q1", text: "E kam vështir të relaksohem" },
    { id: "q2", text: "Goja më thahet" },
    { id: "q3", text: "Nuk kam përjetu ndjenjat pozitive" },
    {
      id: "q4",
      text: "Kam vështërsi në frymemarje (p.sh; edhe pse nuk bëjë ushtrime fizike, veshtërsi në frymarje apo ritëm të shpejt në zemer kam)",
    },
    { id: "q5", text: "Punët që dua të bëjë, e kam të vështir tija fillojë" },
    { id: "q6", text: "Reagojë shpejt ndaj ngjarjeve" },
    { id: "q7", text: "Ndjej dridhje në trupe (p.sh; dridhja e duarve)" },
    { id: "q8", text: "Ndjej se shum energji hargjoj si skak i nervozës" },
    {
      id: "q9",
      text: "Shqetësohem për shkak të situatave ku mund të dukem qesharak dhe të më kaplojë paniku",
    },
    { id: "q10", text: "Nuk pres asgjë dhe nuk shpresojë azgjë" },
    { id: "q11", text: "Bie shpejt në provokime" },
    { id: "q12", text: "Kam vështërsi të relaksohem" },
    { id: "q13", text: "Ndjehem i trishtuar dhe i len pas dore" },
    { id: "q14", text: "Nuk toleroj pengesa në punë" },
    { id: "q15", text: "Mua më kapë paniku shum leht" },
    { id: "q16", text: "Unë nuk jam entuziast dhe i gëzuar për të bërë diçka" },
    { id: "q17", text: "E ndjej vetën si njeri i pa vlefshëm" },
    { id: "q18", text: "Jam tepër i ndjeshëm dhe prekem shpejt" },
    {
      id: "q19",
      text: "Pa asnjë aktivitet fizik ndjej ritme të shpejta të rrahjes së zemrës (p.sh; rrahjet të forta të zemrës dhe të ndyshueshme)",
    },
    { id: "q20", text: "Friksohem pa ndonjë arsye" },
    { id: "q21", text: "Ndjej se jeta nuk ka kuptim, nuk ja vlen të jetohet" },
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
        "Përkthimi në shqip: Dr. Ertan Basha dhe Mehmet Kaya, Sakarya University, i publikuar në faqen zyrtare të DASS (dass.psy.unsw.edu.au).",
      ],
    },
  ],
  interpretationNote: [
    "Pikëzimi dhe nivelet e ashpërsisë janë sipas Lovibond & Lovibond (1995): shuma e secilës shkallë shumëzohet me 2. DASS është matje sasiore e shqetësimit përgjatë tri boshteve: depresionit, ankthit dhe stresit. Nuk është matje kategorike e diagnozave klinike.",
    "Gjendjet emocionale si depresioni dhe ankthi janë dimensionale: ato ndryshojnë përgjatë një vazhdimësie të ashpërsisë. Për këtë arsye, çdo prag i vetëm për të përcaktuar ashpërsinë klinike është domosdoshmërisht arbitrar.",
    "Emërtimet e niveleve përshkruajnë ku bie rezultati në raport me popullatën. «I lehtë», për shembull, do të thotë se personi është mbi mesataren e popullatës, por ende shumë nën ashpërsinë tipike të personave që kërkojnë ndihmë; nuk do të thotë nivel i lehtë i një çrregullimi.",
    "Rezultatet e DASS nuk përcaktojnë vetë ndërhyrjen e duhur. Ato duhen përdorur së bashku me të gjithë informacionin klinik, nga një profesionist i shëndetit mendor.",
  ],
  source:
    "Lovibond, S. H., & Lovibond, P. F. (1995). Manual for the Depression Anxiety Stress Scales (2nd ed.). Sydney: Psychology Foundation. Përkthimi në shqip: Dr. Ertan Basha dhe Mehmet Kaya (Sakarya University).",
  license: "Në domenin publik; përdoret pa leje.",
};

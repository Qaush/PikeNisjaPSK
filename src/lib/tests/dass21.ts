import type { SeverityBand, TestDefinition } from "./types";

/**
 * DASS-21 — Depression Anxiety Stress Scales, versioni i shkurtër me 21 pyetje.
 * Lovibond SH, Lovibond PF (1995). Manual for the Depression Anxiety Stress Scales (bot. 2).
 * Sydney: Psychology Foundation.
 *
 * Licenca: pyetësori DASS është në domenin publik; nuk kërkohet leje për përdorim
 * (faqja zyrtare: https://dass.psy.unsw.edu.au/, FAQ).
 *
 * Formulimi i pyetjeve, shkalla e përgjigjeve dhe pikëzimi ndjekin materialin që dërgoi
 * psikologia (kërkesa FDTFMxn9, 12.11.2026): formulari DASS-21 me tabelën "DASS 21 SCORE".
 * Pikëzimi sipas atij materiali: 7 pyetje për nënshkallë, shuma e thjeshtë (0–21, PA u
 * shumëzuar me 2) dhe pragjet e DASS-21. Te ankthi tabela e materialit e vinte shumën 5 te
 * "i lehtë"; psikologia e korrigjoi (kërkesa BzVvms02, 12.11.2026) sipas manualit: 4 = i lehtë,
 * 5–7 = i moderuar. Kështu të tri shkallët përputhen me manualin (shuma × 2 ndaj pragjeve të DASS-42).
 *
 * Përkthimi në shqip është bërë nga anglishtja; duhet rishikuar nga psikologu.
 * DASS nuk ka pyetje për vetëlëndim; mesazhi i sigurisë shfaqet te niveli më i rëndë.
 */

type Cutoffs = [normal: number, mild: number, moderate: number, severe: number];

/** Ndërton 5 nivelet e tabelës "DASS 21 SCORE" për një nënshkallë (shuma e thjeshtë, 0–21). */
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
      max: 21,
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
    "DASS-21 (Lovibond & Lovibond, 1995) mat veçmas tri gjendje emocionale: depresionin, ankthin dhe stresin. Përbëhet nga 21 pohime të shkurtra dhe zgjat rreth 5 minuta. Raporti jep një rezultat për secilën shkallë.",
  instruction:
    "Lexoni secilin pohim dhe zgjidhni numrin 0, 1, 2 ose 3 që tregon sa ka vlejtur pohimi për ju gjatë javës së fundit. Mos kaloni shumë kohë në asnjë pohim.",
  timeframe: "java e fundit",
  minutes: 5,
  options: [
    { value: 0, label: "Nuk vlen aspak për mua – KURRË", short: "Kurrë" },
    {
      value: 1,
      label: "Vlen për mua deri diku, ose herë pas here – NGANJËHERË",
      short: "Nganjëherë",
    },
    {
      value: 2,
      label: "Vlen për mua në masë të konsiderueshme, ose një pjesë të mirë të kohës – SHPESH",
      short: "Shpesh",
    },
    {
      value: 3,
      label: "Vlen shumë për mua, ose shumicën e kohës – POTHUAJSE GJITHMONË",
      short: "Pothuajse gjithmonë",
    },
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
  bands: [],
  subscales: [
    {
      id: "depresioni",
      label: "Depresioni",
      questionIds: ["q3", "q5", "q10", "q13", "q16", "q17", "q21"],
      bands: bands("depresionin", [4, 6, 10, 13]),
    },
    {
      id: "ankthi",
      label: "Ankthi",
      questionIds: ["q2", "q4", "q7", "q9", "q15", "q19", "q20"],
      bands: bands("ankthin", [3, 4, 7, 9]),
    },
    {
      id: "stresi",
      label: "Stresi",
      questionIds: ["q1", "q6", "q8", "q11", "q12", "q14", "q18"],
      bands: bands("stresin", [7, 9, 12, 16]),
    },
  ],
  interpretationNote: [
    "Pikëzimi dhe nivelet e ashpërsisë janë sipas Lovibond & Lovibond (1995). DASS është matje sasiore e shqetësimit përgjatë tri boshteve: depresionit, ankthit dhe stresit. Nuk është matje kategorike e diagnozave klinike. Shkalla e ankthit mat kryesisht simptomat e zgjimit fiziologjik, ndërsa shkalla e stresit simptomat më kognitive dhe subjektive.",
    "Gjendjet emocionale si depresioni dhe ankthi janë dimensionale: ato ndryshojnë përgjatë një vazhdimësie të ashpërsisë. Për këtë arsye, çdo prag i vetëm për të përcaktuar ashpërsinë klinike është domosdoshmërisht arbitrar.",
    "Emërtimet e niveleve përshkruajnë ku bie rezultati në raport me popullatën. «I lehtë», për shembull, do të thotë se personi është mbi mesataren e popullatës, por ka gjasa të jetë ende shumë nën ashpërsinë tipike të dikujt që kërkon ndihmë; nuk do të thotë nivel i lehtë i një çrregullimi.",
    "Rezultatet e DASS nuk përcaktojnë vetë ndërhyrjen e duhur. Ato duhen përdorur së bashku me të gjithë informacionin klinik, nga një profesionist i shëndetit mendor.",
  ],
  source:
    "Lovibond, S. H., & Lovibond, P. F. (1995). Manual for the Depression Anxiety Stress Scales (2nd ed.). Sydney: Psychology Foundation.",
  license: "Në domenin publik; përdoret pa leje.",
};

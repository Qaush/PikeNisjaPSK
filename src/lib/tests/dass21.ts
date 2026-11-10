import type { SeverityBand, TestDefinition } from "./types";

/**
 * DASS-21 — Depression Anxiety Stress Scales, versioni i shkurtër me 21 pyetje.
 * Lovibond SH, Lovibond PF (1995). Manual for the Depression Anxiety Stress Scales (bot. 2).
 * Sydney: Psychology Foundation.
 *
 * Licenca: pyetësori është në domenin publik; nuk kërkohet leje për përdorim
 * (faqja zyrtare: https://dass.psy.unsw.edu.au/, FAQ).
 *
 * Pikëzimi: 7 pyetje për secilën nënshkallë, shuma shumëzohet me 2 (që të krahasohet me
 * DASS-42) dhe krahasohet me intervalet e manualit. Emërtimet e niveleve përshkruajnë
 * pozitën ndaj popullatës; nuk janë diagnozë.
 *
 * SHËNIM: Përkthimi në shqip është përkthim pune (kërkesa VCQ2XERZ, 10.11.2026) dhe duhet
 * rishikuar nga psikologu. Te faqja zyrtare e DASS ka edhe përkthime të publikuara për krahasim.
 * DASS nuk ka pyetje për vetëlëndim; mesazhi i sigurisë shfaqet te nivelet e rënda.
 */

type Cutoffs = [normal: number, mild: number, moderate: number, severe: number];

/** Ndërton 5 nivelet e manualit për një nënshkallë (pikët tashmë të shumëzuara me 2). */
function bands(what: string, cut: Cutoffs, selfCare: string): SeverityBand[] {
  const [normal, mild, moderate, severe] = cut;
  return [
    {
      min: 0,
      max: normal,
      level: "Normal",
      tone: "ok",
      summary: `Përgjigjet tuaja për ${what} janë brenda kufijve të zakonshëm për javën e fundit.`,
      recommendation:
        "Nuk ka tregues për shqetësim në këtë moment. Mund ta përsëritni testin pas disa javësh, sidomos pas një periudhe të ngarkuar.",
    },
    {
      min: normal + 1,
      max: mild,
      level: "I lehtë",
      tone: "mild",
      summary: `Përgjigjet tuaja tregojnë nivel të lehtë për ${what}, pak mbi atë që përjeton shumica e njerëzve.`,
      recommendation: `${selfCare} Nëse gjendja vazhdon disa javë ose ju pengon në përditshmëri, bisedoni me një profesionist.`,
    },
    {
      min: mild + 1,
      max: moderate,
      level: "I moderuar",
      tone: "moderate",
      summary: `Përgjigjet tuaja tregojnë nivel të moderuar për ${what}, që ka gjasa të ndikojë në punë, marrëdhënie ose gjumë.`,
      recommendation:
        "Në këtë nivel rekomandohet një bisedë me psikolog ose mjek për një vlerësim më të plotë. Sa më herët të adresohet, aq më lehtë përmirësohet.",
    },
    {
      min: moderate + 1,
      max: severe,
      level: "I rëndë",
      tone: "high",
      summary: `Përgjigjet tuaja tregojnë nivel të rëndë për ${what}. Ky nivel zakonisht e vështirëson ndjeshëm jetën e përditshme.`,
      recommendation:
        "Ju rekomandojmë të kontaktoni sa më shpejt një psikolog ose mjek për një vlerësim të plotë. Kjo gjendje trajtohet, dhe ndihma profesionale bën diferencë.",
    },
    {
      min: severe + 1,
      max: 42,
      level: "Shumë i rëndë",
      tone: "severe",
      summary: `Përgjigjet tuaja tregojnë nivel shumë të rëndë për ${what}.`,
      recommendation:
        "Ju rekomandojmë fuqimisht të kërkoni ndihmë profesionale pa vonesë. Nuk keni pse ta përballoni vetëm; një psikolog ose mjek mund t'ju ndihmojë.",
    },
  ];
}

export const dass21: TestDefinition = {
  slug: "dass21",
  code: "DASS-21",
  title: "Depresioni, ankthi dhe stresi (DASS-21)",
  tagline: "Tri matje në një test: humori, ankthi dhe tensioni gjatë javës së fundit.",
  description:
    "DASS-21 mat veçmas tri gjendje emocionale: depresionin, ankthin dhe stresin. Përbëhet nga 21 fjali të shkurtra dhe zgjat rreth 5 minuta. Raporti jep një rezultat për secilën prej tyre.",
  instruction:
    "Lexoni secilën fjali dhe zgjidhni sa ka vlejtur për ju gjatë javës së fundit. Mos u ndalni gjatë te asnjë fjali.",
  timeframe: "java e fundit",
  minutes: 5,
  options: [
    { value: 0, label: "Nuk vlen aspak për mua" },
    { value: 1, label: "Vlen deri diku, ose herë pas here" },
    { value: 2, label: "Vlen në masë të konsiderueshme, ose një pjesë të mirë të kohës" },
    { value: 3, label: "Vlen shumë, ose shumicën e kohës" },
  ],
  questions: [
    { id: "q1", text: "E kam pasur të vështirë të qetësohem." },
    { id: "q2", text: "Kam vënë re se më thahej goja." },
    { id: "q3", text: "Nuk kam mundur të përjetoj asnjë ndjenjë pozitive." },
    {
      id: "q4",
      text: "Kam pasur vështirësi në frymëmarrje (p.sh. frymëmarrje shumë të shpejtë, ose mungesë fryme pa bërë përpjekje fizike).",
    },
    { id: "q5", text: "E kam pasur të vështirë të gjej vullnet për të filluar gjërat." },
    { id: "q6", text: "Kam pasur prirje të reagoj tepër ndaj situatave." },
    { id: "q7", text: "Kam pasur dridhje (p.sh. në duar)." },
    { id: "q8", text: "Kam ndier se po shpenzoja shumë energji nervore." },
    {
      id: "q9",
      text: "Jam shqetësuar për situata në të cilat mund të më kapte paniku dhe të turpërohesha.",
    },
    { id: "q10", text: "Kam ndier se nuk kisha asgjë për të pritur me gëzim." },
    { id: "q11", text: "E kam vënë re se po acarohesha." },
    { id: "q12", text: "E kam pasur të vështirë të relaksohem." },
    { id: "q13", text: "Jam ndier i/e dëshpëruar dhe i/e mërzitur." },
    {
      id: "q14",
      text: "Nuk kam duruar asgjë që më pengonte të vazhdoja atë që isha duke bërë.",
    },
    { id: "q15", text: "Kam ndier se isha afër panikut." },
    { id: "q16", text: "Nuk kam mundur të entuziazmohem për asgjë." },
    { id: "q17", text: "Kam ndier se nuk vlej shumë si njeri." },
    { id: "q18", text: "Kam ndier se isha mjaft i/e prekshëm/e." },
    {
      id: "q19",
      text: "I kam ndier rrahjet e zemrës pa bërë përpjekje fizike (p.sh. rrahje të shpejtuara, ose sikur zemra kapërcente një rrahje).",
    },
    { id: "q20", text: "Jam ndier i/e frikësuar pa ndonjë arsye të vërtetë." },
    { id: "q21", text: "Kam ndier se jeta nuk kishte kuptim." },
  ],
  multiplier: 2,
  bands: [],
  subscales: [
    {
      id: "depresioni",
      label: "Depresioni",
      questionIds: ["q3", "q5", "q10", "q13", "q16", "q17", "q21"],
      bands: bands(
        "depresionin",
        [9, 13, 20, 27],
        "Aktiviteti fizik, gjumi i rregullt dhe kontakti me njerëz të afërt shpesh ndihmojnë.",
      ),
    },
    {
      id: "ankthi",
      label: "Ankthi",
      questionIds: ["q2", "q4", "q7", "q9", "q15", "q19", "q20"],
      bands: bands(
        "ankthin",
        [7, 9, 14, 19],
        "Teknikat e frymëmarrjes, kufizimi i kafeinës dhe gjumi i rregullt shpesh ndihmojnë.",
      ),
    },
    {
      id: "stresi",
      label: "Stresi",
      questionIds: ["q1", "q6", "q8", "q11", "q12", "q14", "q18"],
      bands: bands(
        "stresin",
        [14, 18, 25, 33],
        "Pushimet e rregullta, aktiviteti fizik dhe vendosja e kufijve në ngarkesë shpesh ndihmojnë.",
      ),
    },
  ],
  source:
    "Lovibond SH, Lovibond PF. Manual for the Depression Anxiety Stress Scales. Bot. 2. Sydney: Psychology Foundation; 1995.",
  license: "Në domenin publik; përdoret pa leje.",
};

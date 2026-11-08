import type { TestDefinition } from "./types";

/**
 * GAD-7 — Generalised Anxiety Disorder 7-item scale.
 * Spitzer RL, Kroenke K, Williams JBW, Löwe B (2006).
 * Instrumenti është i lirë për përdorim (zhvilluar me mbështetje të Pfizer, pa licencë).
 *
 * SHËNIM: Përkthimi në shqip këtu është përkthim pune dhe duhet rishikuar nga një
 * psikolog klinik para përdorimit me klientë realë. Ekziston edhe një version zyrtar
 * shqip te phqscreeners.com që mund të krahasohet.
 */
export const gad7: TestDefinition = {
  slug: "ankthi",
  code: "GAD-7",
  title: "Testi i ankthit (GAD-7)",
  tagline: "Sa shpesh ju shqetëson ankthi dhe shqetësimi i tepërt?",
  description:
    "GAD-7 është një nga instrumentet më të përdorura në botë për të vlerësuar simptomat e ankthit të përgjithësuar. Përbëhet nga 7 pyetje të shkurtra dhe zgjat rreth 2 minuta.",
  instruction:
    "Gjatë dy javëve të fundit, sa shpesh jeni shqetësuar nga problemet e mëposhtme?",
  timeframe: "dy javët e fundit",
  minutes: 2,
  options: [
    { value: 0, label: "Aspak" },
    { value: 1, label: "Disa ditë" },
    { value: 2, label: "Më shumë se gjysmën e ditëve" },
    { value: 3, label: "Pothuajse çdo ditë" },
  ],
  questions: [
    { id: "q1", text: "Jeni ndier nervoz/e, në ankth ose i/e tensionuar." },
    { id: "q2", text: "Nuk keni mundur të ndaloni ose të kontrolloni shqetësimin." },
    { id: "q3", text: "Jeni shqetësuar së tepërmi për gjëra të ndryshme." },
    { id: "q4", text: "Keni pasur vështirësi të relaksoheni." },
    {
      id: "q5",
      text: "Keni qenë aq i/e shqetësuar sa e keni pasur të vështirë të rrini ulur.",
    },
    { id: "q6", text: "Jeni nervozuar ose irrituar lehtë." },
    { id: "q7", text: "Keni ndier frikë sikur diçka e tmerrshme mund të ndodhë." },
  ],
  bands: [
    {
      min: 0,
      max: 4,
      level: "Minimal",
      tone: "ok",
      summary:
        "Përgjigjet tuaja tregojnë pak ose aspak simptoma të ankthit gjatë dy javëve të fundit.",
      recommendation:
        "Nuk ka asnjë tregues për shqetësim në këtë moment. Nëse gjendja ndryshon ose keni periudha stresi, mund ta përsëritni testin pas disa javësh.",
    },
    {
      min: 5,
      max: 9,
      level: "I lehtë",
      tone: "mild",
      summary:
        "Përgjigjet tuaja tregojnë simptoma të lehta ankthi. Shumë njerëz kalojnë periudha të tilla, sidomos në kohë stresi.",
      recommendation:
        "Vëzhgojeni gjendjen për disa javë. Gjumi i rregullt, aktiviteti fizik dhe teknikat e frymëmarrjes shpesh ndihmojnë. Nëse simptomat vazhdojnë ose ju pengojnë në përditshmëri, bisedoni me një profesionist.",
    },
    {
      min: 10,
      max: 14,
      level: "I moderuar",
      tone: "moderate",
      summary:
        "Përgjigjet tuaja tregojnë simptoma të moderuara ankthi, që ka gjasa të ndikojnë në punën, marrëdhëniet ose gjumin tuaj.",
      recommendation:
        "Në këtë nivel rekomandohet një vlerësim nga një psikolog ose mjek. Ankthi i moderuar trajtohet mirë me terapi (p.sh. CBT) dhe nuk ka pse të pritet të përkeqësohet.",
    },
    {
      min: 15,
      max: 21,
      level: "I rëndë",
      tone: "severe",
      summary:
        "Përgjigjet tuaja tregojnë simptoma të rënda ankthi. Ky nivel zakonisht ndikon ndjeshëm në jetën e përditshme.",
      recommendation:
        "Ju rekomandojmë fuqimisht të kontaktoni sa më shpejt një psikolog ose mjek për një vlerësim të plotë. Ankthi i rëndë është i trajtueshëm, dhe ndihma profesionale bën diferencë të madhe.",
    },
  ],
  source: "Spitzer RL, Kroenke K, Williams JBW, Löwe B. Arch Intern Med. 2006;166:1092-1097.",
  license: "I lirë për përdorim, pa licencë.",
};

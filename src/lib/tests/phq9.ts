import type { TestDefinition } from "./types";

/**
 * PHQ-9 — Patient Health Questionnaire, 9 pyetje për depresionin.
 * Kroenke K, Spitzer RL, Williams JBW (2001).
 * Instrumenti është i lirë për përdorim (zhvilluar me mbështetje të Pfizer, pa licencë).
 *
 * SHËNIM: Përkthimi në shqip është përkthim pune; duhet rishikuar nga psikolog klinik.
 * Pyetja 9 është sinjalizuese (mendime për vetëlëndim) dhe aktivizon mesazhin e sigurisë.
 */
export const phq9: TestDefinition = {
  slug: "depresioni",
  code: "PHQ-9",
  title: "Testi i depresionit (PHQ-9)",
  tagline: "Si ka qenë humori dhe energjia juaj kohët e fundit?",
  description:
    "PHQ-9 është instrumenti standard për vlerësimin e simptomave të depresionit, i përdorur nga mjekët dhe psikologët në gjithë botën. Ka 9 pyetje dhe zgjat rreth 3 minuta.",
  instruction:
    "Gjatë dy javëve të fundit, sa shpesh jeni shqetësuar nga problemet e mëposhtme?",
  timeframe: "dy javët e fundit",
  minutes: 3,
  options: [
    { value: 0, label: "Aspak" },
    { value: 1, label: "Disa ditë" },
    { value: 2, label: "Më shumë se gjysmën e ditëve" },
    { value: 3, label: "Pothuajse çdo ditë" },
  ],
  questions: [
    { id: "q1", text: "Pak interes ose kënaqësi për të bërë gjëra." },
    { id: "q2", text: "Jeni ndier i/e mërzitur, në depresion ose pa shpresë." },
    {
      id: "q3",
      text: "Vështirësi për të fjetur ose për të qëndruar në gjumë, ose keni fjetur shumë.",
    },
    { id: "q4", text: "Jeni ndier i/e lodhur ose me pak energji." },
    { id: "q5", text: "Oreks i dobët, ose keni ngrënë së tepërmi." },
    {
      id: "q6",
      text: "Jeni ndier keq për veten, ose se jeni dështak/e, ose se keni zhgënjyer veten a familjen tuaj.",
    },
    {
      id: "q7",
      text: "Vështirësi për t'u përqendruar, p.sh. kur lexoni ose shikoni televizor.",
    },
    {
      id: "q8",
      text: "Keni lëvizur ose folur aq ngadalë sa të tjerët mund ta kenë vënë re, ose e kundërta: keni qenë aq i/e shqetësuar sa keni lëvizur shumë më tepër se zakonisht.",
    },
    {
      id: "q9",
      text: "Mendime se do të ishte më mirë të mos jetonit, ose për t'i bërë keq vetes në ndonjë mënyrë.",
      safetyFlag: true,
    },
  ],
  bands: [
    {
      min: 0,
      max: 4,
      level: "Minimal",
      tone: "ok",
      summary:
        "Përgjigjet tuaja tregojnë pak ose aspak simptoma të depresionit gjatë dy javëve të fundit.",
      recommendation:
        "Nuk ka tregues për shqetësim në këtë moment. Kujdesuni për gjumin, lëvizjen dhe kontaktet shoqërore, dhe përsëriteni testin nëse vini re ndryshime.",
    },
    {
      min: 5,
      max: 9,
      level: "I lehtë",
      tone: "mild",
      summary:
        "Përgjigjet tuaja tregojnë simptoma të lehta depresioni. Këto shpesh lidhen me periudha stresi ose ndryshimesh në jetë.",
      recommendation:
        "Vëzhgojeni gjendjen për 2–4 javë. Nëse simptomat vazhdojnë ose ju pengojnë në punë dhe marrëdhënie, një bisedë me psikolog është një hap i mirë.",
    },
    {
      min: 10,
      max: 14,
      level: "I moderuar",
      tone: "moderate",
      summary:
        "Përgjigjet tuaja tregojnë simptoma të moderuara depresioni, që ka gjasa të ndikojnë në funksionimin tuaj të përditshëm.",
      recommendation:
        "Në këtë nivel rekomandohet vlerësim nga një psikolog ose mjek. Depresioni i moderuar u përgjigjet mirë terapisë, dhe sa më herët të kërkohet ndihma, aq më shpejt vjen përmirësimi.",
    },
    {
      min: 15,
      max: 19,
      level: "Mesatarisht i rëndë",
      tone: "high",
      summary:
        "Përgjigjet tuaja tregojnë simptoma mesatarisht të rënda depresioni, që zakonisht ndikojnë ndjeshëm në jetën e përditshme.",
      recommendation:
        "Ju rekomandojmë të kontaktoni së shpejti një psikolog ose mjek për vlerësim dhe plan trajtimi. Mos e shtyni; ky nivel trajtohet, por ka nevojë për mbështetje profesionale.",
    },
    {
      min: 20,
      max: 27,
      level: "I rëndë",
      tone: "severe",
      summary:
        "Përgjigjet tuaja tregojnë simptoma të rënda depresioni.",
      recommendation:
        "Ju lutemi kontaktoni sa më shpejt një profesionist të shëndetit mendor ose mjekun tuaj. Nëse ndiheni në rrezik, përdorni numrat e urgjencës më poshtë. Nuk jeni vetëm, dhe ndihma ekziston.",
    },
  ],
  about: [
    {
      heading: "Çfarë është PHQ-9",
      paragraphs: [
        "PHQ-9 (Patient Health Questionnaire-9) është një pyetësor vetëraportues me 9 pohime, i zhvilluar nga Kroenke, Spitzer dhe Williams (2001) si pjesë e Patient Health Questionnaire. Secili pohim i përgjigjet njërit nga nëntë kriteret diagnostike të episodit të depresionit madhor.",
        "Pohimet mbulojnë humbjen e interesit dhe të kënaqësisë, humorin e dëshpëruar, gjumin, energjinë, oreksin, ndjenjën e pavlefshmërisë ose të fajit, përqendrimin, ngadalësimin ose shqetësimin psikomotor dhe mendimet për vdekjen ose vetëlëndimin.",
      ],
    },
    {
      heading: "Për çka shërben",
      paragraphs: [
        "Përdoret për depistimin (screening) e depresionit, për të matur ashpërsinë e simptomave dhe për të ndjekur ndryshimin e tyre me kalimin e kohës, për shembull përgjigjen ndaj trajtimit. Është një nga instrumentet më të përdorura në kujdesin parësor shëndetësor, në praktikën klinike dhe në hulumtim.",
      ],
    },
    {
      heading: "Kufizimet",
      paragraphs: [
        "PHQ-9 është instrument depistimi, jo instrument diagnostikues. Ai mat simptomat që keni raportuar për dy javët e fundit dhe nuk dallon shkaqet e tyre, si humbja e një të afërmi, gjendje të tjera shëndetësore ose efektet e barnave. Diagnoza vendoset vetëm nga një psikolog ose psikiatër i licencuar, pas një vlerësimi të plotë klinik.",
      ],
    },
    {
      heading: "Autorët",
      paragraphs: [
        "Kroenke, K., Spitzer, R. L., & Williams, J. B. W. (2001). The PHQ-9: Validity of a brief depression severity measure. Journal of General Internal Medicine, 16(9), 606–613.",
      ],
    },
  ],
  source: "Kroenke K, Spitzer RL, Williams JBW. J Gen Intern Med. 2001;16:606-613.",
  license: "I lirë për përdorim, pa licencë.",
};

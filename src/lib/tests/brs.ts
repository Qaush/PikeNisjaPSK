import type { TestDefinition } from "./types";

/**
 * BRS — Brief Resilience Scale (6 pyetje).
 * Smith BW, Dalen J, Wiggins K, Tooley E, Christopher P, Bernard J (2008).
 * The Brief Resilience Scale: assessing the ability to bounce back.
 * Int J Behav Med. 15(3):194-200.
 *
 * Pikëzimi: shkallë 1–5; pyetjet 2, 4 dhe 6 pikëzohen në të kundërt; rezultati është
 * mesatarja e 6 pyetjeve. Interpretimi (Smith et al., 2013): 1,00–2,99 e ulët,
 * 3,00–4,30 normale, 4,31–5,00 e lartë. Intervalet janë përshkruese, jo klinike.
 *
 * LICENCA – PËR T'U SQARUAR PARA PUBLIKIMIT: burimet e gjetura e përshkruajnë si të lirë
 * për kërkim dhe edukim me citim të autorëve; për përdorim me pagesë nuk u gjet leje e
 * shprehur. Para se testi të shitet, duhet konfirmim nga autori (Bruce W. Smith).
 *
 * SHËNIM: Përkthimi në shqip është përkthim pune (kërkesa VCQ2XERZ, 10.11.2026) dhe duhet
 * rishikuar nga psikologu.
 */
export const brs: TestDefinition = {
  slug: "rezilienca",
  code: "BRS",
  title: "Rezilienca (Brief Resilience Scale)",
  tagline: "Sa shpejt e merrni veten pas periudhave të vështira?",
  description:
    "Brief Resilience Scale mat aftësinë për ta marrë veten pas stresit dhe vështirësive. Përbëhet nga 6 fjali dhe zgjat rreth 1 minutë.",
  instruction: "Për secilën fjali, zgjidhni sa pajtoheni me të.",
  timeframe: "në përgjithësi",
  minutes: 1,
  options: [
    { value: 1, label: "Nuk pajtohem aspak" },
    { value: 2, label: "Nuk pajtohem" },
    { value: 3, label: "Neutral" },
    { value: 4, label: "Pajtohem" },
    { value: 5, label: "Pajtohem plotësisht" },
  ],
  questions: [
    { id: "q1", text: "Zakonisht e marr veten shpejt pas kohëve të vështira." },
    { id: "q2", text: "E kam të vështirë t'i kaloj ngjarjet stresuese.", reverse: true },
    { id: "q3", text: "Nuk më duhet shumë kohë për ta marrë veten pas një ngjarjeje stresuese." },
    {
      id: "q4",
      text: "E kam të vështirë ta marr veten shpejt kur ndodh diçka e keqe.",
      reverse: true,
    },
    { id: "q5", text: "Zakonisht i kaloj kohët e vështira pa shumë telashe." },
    {
      id: "q6",
      text: "Zakonisht më duhet shumë kohë për t'i kapërcyer pengesat në jetën time.",
      reverse: true,
    },
  ],
  scoring: "mean",
  bands: [
    {
      min: 1,
      max: 2.99,
      level: "E ulët",
      tone: "moderate",
      summary:
        "Përgjigjet tuaja tregojnë reziliencë të ulët: pas ngjarjeve stresuese ju duhet më shumë kohë dhe mund për ta marrë veten.",
      recommendation:
        "Rezilienca nuk është tipar i lindur; ajo ndërtohet. Rrjeti i njerëzve të afërt, rutina e gjumit dhe aktiviteti fizik ndihmojnë. Një psikolog mund t'ju ndihmojë të ndërtoni mënyra konkrete për t'u përballur me stresin.",
    },
    {
      min: 3,
      max: 4.3,
      level: "Normale",
      tone: "ok",
      summary:
        "Përgjigjet tuaja tregojnë reziliencë normale: zakonisht e merrni veten pas vështirësive brenda një kohe të arsyeshme.",
      recommendation:
        "Vazhdoni me ato që ju ndihmojnë tashmë. Në periudha veçanërisht të ngarkuara, kujdesi për gjumin, lëvizjen dhe kontaktet e afërta e mban këtë aftësi.",
    },
    {
      min: 4.31,
      max: 5,
      level: "E lartë",
      tone: "ok",
      summary:
        "Përgjigjet tuaja tregojnë reziliencë të lartë: e merrni veten shpejt pas ngjarjeve stresuese.",
      recommendation:
        "Kjo është një forcë e rëndësishme. Mbani parasysh që edhe njerëzit me reziliencë të lartë kanë periudha kur u duhet mbështetje; kërkimi i ndihmës nuk e ul atë.",
    },
  ],
  about: [
    {
      heading: "Çfarë është Brief Resilience Scale",
      paragraphs: [
        "Brief Resilience Scale (BRS) është një pyetësor vetëraportues me 6 pohime, i zhvilluar nga Smith dhe bashkëpunëtorët (2008). Ai mat reziliencën në kuptimin e saj bazë: aftësinë për ta marrë veten, pra për t'u rikthyer në gjendjen e mëparshme pas stresit.",
        "Kjo e dallon nga shumica e shkallëve të tjera të reziliencës, të cilat matin burimet që e bëjnë reziliencën të mundshme (si mbështetja sociale ose optimizmi), dhe jo vetë aftësinë për t'u rimëkëmbur.",
      ],
    },
    {
      heading: "Për çka shërben",
      paragraphs: [
        "Përdoret në hulumtim dhe në praktikë për të vlerësuar sa lehtë një person e merr veten pas ngjarjeve stresuese, si dhe për të ndjekur ndryshimin e kësaj aftësie me kalimin e kohës. Nuk mat simptoma të një çrregullimi; rezultati i ulët nuk është shenjë sëmundjeje.",
      ],
    },
    {
      heading: "Kufizimet",
      paragraphs: [
        "BRS është një matje e shkurtër e bazuar në vetëvlerësim dhe pasqyron mënyrën si e shihni veten në këtë moment. Rezultati nuk është diagnozë dhe nuk parashikon si do të reagoni në çdo situatë të vështirë.",
      ],
    },
    {
      heading: "Autorët",
      paragraphs: [
        "Smith, B. W., Dalen, J., Wiggins, K., Tooley, E., Christopher, P., & Bernard, J. (2008). The Brief Resilience Scale: Assessing the ability to bounce back. International Journal of Behavioral Medicine, 15(3), 194–200.",
      ],
    },
  ],
  source:
    "Smith BW, Dalen J, Wiggins K, Tooley E, Christopher P, Bernard J. Int J Behav Med. 2008;15(3):194-200.",
  license: "Përdoret me citim të autorëve.",
};

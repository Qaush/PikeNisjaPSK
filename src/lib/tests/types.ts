/**
 * Modeli i një testi psikometrik vetëvlerësues.
 *
 * Çdo test ka një listë pyetjesh me të njëjtat opsione përgjigjeje (shkallë Likert),
 * dhe një listë "bandash" (intervalesh) që e kthejnë pikën totale në një nivel ashpërsie
 * me tekst shpjegues për raportin.
 */

export type AnswerOption = {
  value: number;
  label: string;
};

export type Question = {
  id: string;
  text: string;
  /** Pyetje "sinjalizuese": çdo përgjigje > 0 shfaq mesazhin e sigurisë në raport. */
  safetyFlag?: boolean;
};

export type SeverityBand = {
  /** Pika minimale (përfshirëse) e këtij intervali. */
  min: number;
  /** Pika maksimale (përfshirëse). */
  max: number;
  /** Emri i nivelit, p.sh. "I lehtë". */
  level: string;
  /** Ngjyra e nivelit për UI (klasa Tailwind-i ose çelës semantik). */
  tone: "ok" | "mild" | "moderate" | "high" | "severe";
  /** Shpjegim i shkurtër se çfarë do të thotë ky rezultat. */
  summary: string;
  /** Çfarë sugjerohet të bëhet më tej. */
  recommendation: string;
};

export type TestDefinition = {
  slug: string;
  /** Emri i shkurtër, p.sh. "GAD-7". */
  code: string;
  /** Titulli i plotë në shqip. */
  title: string;
  /** Çfarë mat testi, në një fjali. */
  tagline: string;
  /** Përshkrim më i gjatë për faqen e testit. */
  description: string;
  /** Udhëzimi që shfaqet mbi pyetjet. */
  instruction: string;
  /** Periudha kohore që mbulon testi, p.sh. "dy javët e fundit". */
  timeframe: string;
  /** Kohëzgjatja e përafërt në minuta. */
  minutes: number;
  options: AnswerOption[];
  questions: Question[];
  bands: SeverityBand[];
  /** Burimi/autorët e instrumentit origjinal, për transparencë në raport. */
  source: string;
  /** Statusi i licencës: a lejohet përdorimi pa pagesë. */
  license: string;
};

export type TestResult = {
  score: number;
  maxScore: number;
  band: SeverityBand;
  /** True nëse ndonjë pyetje sinjalizuese ka marrë përgjigje > 0. */
  safetyFlag: boolean;
};

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
  /** Emërtim i shkurtër për listën e përgjigjeve në raport, kur `label` është i gjatë. */
  short?: string;
};

export type Question = {
  id: string;
  text: string;
  /** Pyetje "sinjalizuese": çdo përgjigje > 0 shfaq mesazhin e sigurisë në raport. */
  safetyFlag?: boolean;
  /** Pyetje e formuluar në të kundërt: pikëzohet (min + max − përgjigjja). */
  reverse?: boolean;
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

/** Nënshkallë e një testi (p.sh. Depresioni / Ankthi / Stresi te DASS-21), me intervalet e veta. */
export type Subscale = {
  id: string;
  label: string;
  questionIds: string[];
  bands: SeverityBand[];
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
  /**
   * Mënyra e pikëzimit: "sum" (parazgjedhja) mbledh përgjigjet; "mean" merr mesataren
   * (p.sh. BRS). Intervalet (bands) janë në të njëjtën njësi me pikën e llogaritur.
   */
  scoring?: "sum" | "mean";
  /** Shumëzues i shumës (DASS-21 = 2, që pikët të krahasohen me DASS-42). */
  multiplier?: number;
  /**
   * Nënshkallët. Kur ekzistojnë, secila pikëzohet veç dhe niveli i përgjithshëm i raportit
   * është ai i nënshkallës më të rëndë; `bands` i testit nuk përdoret.
   */
  subscales?: Subscale[];
  /**
   * Shpjegimi i hollësishëm i testit (çfarë është, për çka shërben, si lexohet rezultati),
   * që shfaqet në faqen e parë të testit, para butonit "Fillo testin".
   */
  about?: { heading: string; paragraphs: string[] }[];
  /** Shënim për interpretimin, sipas manualit të instrumentit; shfaqet në raport (paragrafë). */
  interpretationNote?: string[];
  /** Burimi/autorët e instrumentit origjinal, për transparencë në raport. */
  source: string;
  /** Statusi i licencës: a lejohet përdorimi pa pagesë. */
  license: string;
};

export type SubscaleResult = {
  id: string;
  label: string;
  score: number;
  maxScore: number;
  band: SeverityBand;
  bands: SeverityBand[];
};

export type TestResult = {
  score: number;
  maxScore: number;
  /** Pika më e ulët e mundshme (0 te shumat, 1 te mesatarja 1–5); për shiritin e raportit. */
  minScore: number;
  /** Rezultatet e nënshkallëve, kur testi i ka. */
  subscales?: SubscaleResult[];
  band: SeverityBand;
  /** True nëse ndonjë pyetje sinjalizuese ka marrë përgjigje > 0. */
  safetyFlag: boolean;
};

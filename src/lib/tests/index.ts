import { brs } from "./brs";
import { gad7 } from "./gad7";
import { phq9 } from "./phq9";
import type { Question, SeverityBand, TestDefinition, TestResult } from "./types";

export type {
  TestDefinition,
  TestResult,
  SubscaleResult,
  Subscale,
  Question,
  SeverityBand,
  AnswerOption,
} from "./types";

/**
 * Testet e ofruara në faqe. DASS-21 u hoq nga lista me kërkesë të psikologes (a0z5OEoD,
 * 12.11.2026); përkufizimi i tij mbetet te ./dass21.ts dhe kthehet duke e shtuar këtu.
 */
export const TESTS: TestDefinition[] = [gad7, phq9, brs];

export function getTest(slug: string): TestDefinition | undefined {
  return TESTS.find((t) => t.slug === slug);
}

function optionRange(test: TestDefinition): { min: number; max: number } {
  const values = test.options.map((o) => o.value);
  return { min: Math.min(...values), max: Math.max(...values) };
}

/** Pikët maksimale të mundshme për një test (ose për një pjesë të pyetjeve të tij). */
export function maxScore(test: TestDefinition, questionCount = test.questions.length): number {
  const { max } = optionRange(test);
  if (test.scoring === "mean") return max;
  return max * questionCount * (test.multiplier ?? 1);
}

/**
 * Kontrollon që përgjigjet janë të plota dhe me vlera të lejuara.
 * Kthen një mesazh gabimi, ose null nëse gjithçka është në rregull.
 */
export function validateAnswers(
  test: TestDefinition,
  answers: Record<string, number>,
): string | null {
  const allowed = new Set(test.options.map((o) => o.value));
  for (const q of test.questions) {
    const v = answers[q.id];
    if (typeof v !== "number" || !allowed.has(v)) {
      return `Mungon ose është e pavlefshme përgjigjja për pyetjen ${q.id}.`;
    }
  }
  return null;
}

const TONE_ORDER: SeverityBand["tone"][] = ["ok", "mild", "moderate", "high", "severe"];

function pickBand(bands: SeverityBand[], score: number): SeverityBand {
  return bands.find((b) => score >= b.min && score <= b.max) ?? bands[bands.length - 1];
}

/** Llogarit rezultatin e një testi nga përgjigjet. Supozon përgjigje të validuara. */
export function scoreTest(
  test: TestDefinition,
  answers: Record<string, number>,
): TestResult {
  const range = optionRange(test);
  let safetyFlag = false;

  const points = (q: Question): number => {
    const v = answers[q.id] ?? range.min;
    return q.reverse ? range.min + range.max - v : v;
  };
  const scoreOf = (questions: Question[]): number => {
    const sum = questions.reduce((acc, q) => acc + points(q), 0);
    if (test.scoring === "mean") {
      return questions.length ? Math.round((sum / questions.length) * 100) / 100 : 0;
    }
    return sum * (test.multiplier ?? 1);
  };

  for (const q of test.questions) {
    if (q.safetyFlag && (answers[q.id] ?? 0) > 0) safetyFlag = true;
  }

  const score = scoreOf(test.questions);
  const minScore = test.scoring === "mean" ? range.min : 0;

  if (test.subscales?.length) {
    const subscales = test.subscales.map((s) => {
      const questions = test.questions.filter((q) => s.questionIds.includes(q.id));
      const subScore = scoreOf(questions);
      return {
        id: s.id,
        label: s.label,
        score: subScore,
        maxScore: maxScore(test, questions.length),
        band: pickBand(s.bands, subScore),
        bands: s.bands,
      };
    });
    // Niveli i përgjithshëm = nënshkalla më e rëndë (e para, kur janë baras).
    const worst = subscales.reduce((a, b) =>
      TONE_ORDER.indexOf(b.band.tone) > TONE_ORDER.indexOf(a.band.tone) ? b : a,
    );
    return { score, maxScore: maxScore(test), minScore, band: worst.band, safetyFlag, subscales };
  }

  return { score, maxScore: maxScore(test), minScore, band: pickBand(test.bands, score), safetyFlag };
}

/** Pika për shfaqje: numër i plotë te shumat, dy shifra dhjetore me presje te mesatarja. */
export function formatScore(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(".", ",");
}

/** Rezultati në një rresht, për email dhe subjekt: "14 / 21 – I moderuar" ose sipas nënshkallëve. */
export function resultLine(result: TestResult): string {
  if (result.subscales?.length) {
    return result.subscales
      .map((s) => `${s.label} ${formatScore(s.score)}/${s.maxScore} (${s.band.level})`)
      .join("; ");
  }
  return `${formatScore(result.score)} / ${result.maxScore} – ${result.band.level}`;
}

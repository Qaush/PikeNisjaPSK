import { gad7 } from "./gad7";
import { phq9 } from "./phq9";
import type { TestDefinition, TestResult } from "./types";

export type { TestDefinition, TestResult, Question, SeverityBand, AnswerOption } from "./types";

export const TESTS: TestDefinition[] = [gad7, phq9];

export function getTest(slug: string): TestDefinition | undefined {
  return TESTS.find((t) => t.slug === slug);
}

/** Pikët maksimale të mundshme për një test. */
export function maxScore(test: TestDefinition): number {
  const maxOption = Math.max(...test.options.map((o) => o.value));
  return maxOption * test.questions.length;
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

/** Llogarit rezultatin e një testi nga përgjigjet. Supozon përgjigje të validuara. */
export function scoreTest(
  test: TestDefinition,
  answers: Record<string, number>,
): TestResult {
  let score = 0;
  let safetyFlag = false;
  for (const q of test.questions) {
    const v = answers[q.id] ?? 0;
    score += v;
    if (q.safetyFlag && v > 0) safetyFlag = true;
  }
  const band =
    test.bands.find((b) => score >= b.min && score <= b.max) ??
    test.bands[test.bands.length - 1];
  return { score, maxScore: maxScore(test), band, safetyFlag };
}

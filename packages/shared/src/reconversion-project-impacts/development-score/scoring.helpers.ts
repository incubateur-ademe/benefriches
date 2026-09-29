import { filterByName } from "../../filter-by-name";
import { roundTo2Digits, sumList, sumListWithKey } from "../../services";

export type LetterScore = "A" | "B" | "C" | "D" | "E";
export type LetterGrade =
  "A" | "B" | "C" | "D" | "E" | "A+" | "A-" | "B+" | "B-" | "C+" | "C-" | "D+" | "D-" | "E+" | "E-";

const LETTER_SCORE_NUMBER_VALUES: Record<LetterScore, number> = {
  A: 90,
  B: 70,
  C: 50,
  D: 30,
  E: 10,
};

export const convertLetterScoreToNumberScore = (score: LetterScore): number =>
  LETTER_SCORE_NUMBER_VALUES[score];

export const LETTER_GRADE_THRESHOLDS: { grade: LetterGrade; minScore: number }[] = [
  { grade: "A+", minScore: 93.34 },
  { grade: "A", minScore: 86.67 },
  { grade: "A-", minScore: 80 },
  { grade: "B+", minScore: 73.34 },
  { grade: "B", minScore: 66.67 },
  { grade: "B-", minScore: 60 },
  { grade: "C+", minScore: 53.34 },
  { grade: "C", minScore: 46.67 },
  { grade: "C-", minScore: 40 },
  { grade: "D+", minScore: 33.34 },
  { grade: "D", minScore: 26.67 },
  { grade: "D-", minScore: 20 },
  { grade: "E+", minScore: 13.34 },
  { grade: "E", minScore: 6.67 },
  { grade: "E-", minScore: 0 },
];

export const convertNumberScoreToLetterScore = (score: number): LetterGrade =>
  LETTER_GRADE_THRESHOLDS.find(({ minScore }) => score >= minScore)?.grade ?? "E-";

export type ItemScoreResult<TMetrics> = { letterScore: LetterScore; metrics: TMetrics } | undefined;

export const computeSectionScore = <TDetails extends Record<string, ItemScoreResult<unknown>>>(
  details: TDetails,
) => {
  const detailsNumberScores = Object.values(details).map((item) =>
    item ? convertLetterScoreToNumberScore(item.letterScore) : 0,
  );
  const numericScore = roundTo2Digits(sumList(detailsNumberScores) / detailsNumberScores.length);

  return {
    letterScore: convertNumberScoreToLetterScore(numericScore),
    numericScore,
    details,
  };
};

export const sumMetricsTotalByName = <T extends { name: string; total: number }>(
  metrics: readonly T[],
  ...names: T["name"][]
): number => sumListWithKey(filterByName(metrics, ...names), "total");

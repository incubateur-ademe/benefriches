import { filterByName } from "../../filter-by-name";
import { roundTo2Digits, sumList, sumListWithKey } from "../../services";

export type LetterGrade = "A" | "B" | "C" | "D" | "E";
export type LetterGradeWithModifier = LetterGrade | `${LetterGrade}+` | `${LetterGrade}-`;

const LETTER_GRADE_NUMBER_VALUES: Record<LetterGrade, number> = {
  A: 90,
  B: 70,
  C: 50,
  D: 30,
  E: 10,
};

export const convertLetterGradeToGradePoints = (grade: LetterGrade): number =>
  LETTER_GRADE_NUMBER_VALUES[grade];

export const LETTER_GRADE_THRESHOLDS: { grade: LetterGradeWithModifier; minGradePoints: number }[] =
  [
    { grade: "A+", minGradePoints: 93.34 },
    { grade: "A", minGradePoints: 86.67 },
    { grade: "A-", minGradePoints: 80 },
    { grade: "B+", minGradePoints: 73.34 },
    { grade: "B", minGradePoints: 66.67 },
    { grade: "B-", minGradePoints: 60 },
    { grade: "C+", minGradePoints: 53.34 },
    { grade: "C", minGradePoints: 46.67 },
    { grade: "C-", minGradePoints: 40 },
    { grade: "D+", minGradePoints: 33.34 },
    { grade: "D", minGradePoints: 26.67 },
    { grade: "D-", minGradePoints: 20 },
    { grade: "E+", minGradePoints: 13.34 },
    { grade: "E", minGradePoints: 6.67 },
    { grade: "E-", minGradePoints: 0 },
  ];

const getLetterGradeFromLetterGradeWithModifiers = (letterGrade: LetterGradeWithModifier) => {
  switch (letterGrade) {
    case "A":
    case "A+":
    case "A-":
      return "A";
    case "B":
    case "B+":
    case "B-":
      return "B";
    case "C":
    case "C+":
    case "C-":
      return "C";
    case "D":
    case "D+":
    case "D-":
      return "D";
    case "E":
    case "E+":
    case "E-":
      return "E";
  }
};

export type Score = {
  letterGrade: LetterGrade;
  letterGradeWithModifiers: LetterGradeWithModifier;
  gradePoints: number;
};

export const computeScoreFromGradePoints = (gradePoints: number): Score => {
  const letterGradeWithModifiers = convertGradePointsToLetterGrade(gradePoints);

  return {
    letterGradeWithModifiers: letterGradeWithModifiers,
    letterGrade: getLetterGradeFromLetterGradeWithModifiers(letterGradeWithModifiers),
    gradePoints,
  };
};

export const convertGradePointsToLetterGrade = (gradePoints: number): LetterGradeWithModifier =>
  LETTER_GRADE_THRESHOLDS.find(({ minGradePoints }) => gradePoints >= minGradePoints)?.grade ??
  "E-";

export type ScoredMetrics<TMetrics> = { letterGrade: LetterGrade; metrics: TMetrics } | undefined;

export const computeSectionScore = <TDetails extends Record<string, ScoredMetrics<unknown>>>(
  details: TDetails,
) => {
  const gradePointsList = Object.values(details).map((item) =>
    item ? convertLetterGradeToGradePoints(item.letterGrade) : 0,
  );
  const gradePoints = roundTo2Digits(sumList(gradePointsList) / gradePointsList.length);

  return {
    score: computeScoreFromGradePoints(gradePoints),
    details,
  };
};

export const sumMetricsTotalByName = <T extends { name: string; total: number }>(
  metrics: readonly T[],
  ...names: T["name"][]
): number => sumListWithKey(filterByName(metrics, ...names), "total");

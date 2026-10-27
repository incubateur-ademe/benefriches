import { filterByName } from "../../filter-by-name";
import { typedObjectEntries } from "../../object-entries";
import { roundTo2Digits, sumList, sumListWithKey } from "../../services";
import type {
  IndicatorRole,
  LetterGrade,
  LetterGradeWithModifier,
  MainScore,
  WithNullableIndicatorScore,
  WithRequiredIndicatorScore,
} from "./developmentScore.types";

const CORE_LETTER_GRADE_POINTS: Record<LetterGrade, number> = {
  A: 90,
  B: 70,
  C: 50,
  D: 30,
  E: 10,
};

const BONUS_GRADE_POINTS: Record<LetterGrade, number> = {
  A: 6.67,
  B: 3.33,
  C: 0,
  D: -3.33,
  E: -6.67,
};

export const convertLetterGradeToGradePoints = (grade: LetterGrade): number =>
  CORE_LETTER_GRADE_POINTS[grade];

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

export const getLetterGradeFromLetterGradeWithModifiers = (
  letterGrade: LetterGradeWithModifier,
) => {
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

export const computeScoreFromGradePoints = (gradePoints: number): MainScore => {
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

export type NullableIndicatorScore<TMetrics> = {
  letterGrade: LetterGrade | undefined;
  metrics: TMetrics;
};
export type RequiredIndicatorScore<TMetrics> = { letterGrade: LetterGrade; metrics: TMetrics };

const getGradePointsFromRole = (letterGrade: LetterGrade, role: IndicatorRole) =>
  role === "bonus" ? BONUS_GRADE_POINTS[letterGrade] : convertLetterGradeToGradePoints(letterGrade);

export const withNullableIndicatorScore = <
  TRegistry extends {
    role: "core" | "bonus";
    applies: boolean;
    getScore: () => NullableIndicatorScore<unknown>;
  },
>(
  registry: TRegistry,
): WithNullableIndicatorScore<ReturnType<TRegistry["getScore"]>["metrics"]> => {
  if (!registry.applies) {
    return {
      letterGrade: undefined,
      applies: registry.applies,
      gradePoints: 0,
      role: registry.role,
    };
  }
  const { metrics, letterGrade } = registry.getScore();

  return {
    role: registry.role,
    applies: registry.applies,
    metrics,
    letterGrade,
    gradePoints: letterGrade ? getGradePointsFromRole(letterGrade, registry.role) : 0,
  };
};

export const withRequiredIndicatorScore = <S extends RequiredIndicatorScore<unknown>>(
  score: S,
): WithRequiredIndicatorScore<S["metrics"]> => {
  const { metrics, letterGrade } = score;

  return {
    role: "core",
    applies: true,
    metrics,
    letterGrade,
    gradePoints: getGradePointsFromRole(letterGrade, "core"),
  };
};

export const withFamilyScore = <
  TRegistry extends Record<
    keyof TRegistry,
    ReturnType<typeof withRequiredIndicatorScore> | ReturnType<typeof withNullableIndicatorScore>
  >,
>(
  registry: TRegistry,
) => {
  const entries = typedObjectEntries(registry);

  const coreIndicatorList = entries.filter(([, item]) => item.applies && item.role === "core");
  const bonusIndicatorsSum = sumList(
    entries
      .filter(([, item]) => item.applies && item.role === "bonus")
      .map(([, item]) => item.gradePoints ?? 0),
  );
  const coreIndicatorsSum = sumList(coreIndicatorList.map(([, item]) => item.gradePoints ?? 0));

  const gradePoints = roundTo2Digits(
    coreIndicatorList.length > 0
      ? (coreIndicatorsSum + bonusIndicatorsSum) / coreIndicatorList.length
      : 0,
  );

  return {
    score: computeScoreFromGradePoints(gradePoints),
    indicators: registry,
  };
};

export const sumMetricsTotalByName = <T extends { name: string; total: number }>(
  metrics: readonly T[],
  ...names: T["name"][]
): number => sumListWithKey(filterByName(metrics, ...names), "total");

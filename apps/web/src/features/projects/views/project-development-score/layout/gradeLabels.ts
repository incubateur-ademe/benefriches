import type { LetterGrade } from "shared";

export type ScoreBadgeLabelKind = "qualitative" | "evolution" | "impact" | "compliance";

export const LETTER_GRADE_BADGE_TEXT = {
  qualitative: {
    A: "Nettement amélioré",
    B: "Amélioré",
    C: "Neutre",
    D: "Dégradé",
    E: "Nettement dégradé",
  },
  evolution: {
    A: "En forte hausse",
    B: "En hausse significative",
    C: "En légère hausse ou égal",
    D: "En baisse",
    E: "En forte baisse",
  },
  impact: {
    A: "Très positif",
    B: "Positif",
    C: "Neutre",
    D: "Négatif",
    E: "Très négatif",
  },
  compliance: {
    A: "Très favorable",
    B: "Favorable",
    C: "Neutre",
    D: "Défavorable",
    E: "Très défavorable",
  },
} as const satisfies Record<ScoreBadgeLabelKind, Record<LetterGrade, string>>;

export const getLetterGradeBadgeText = (kind: ScoreBadgeLabelKind, letterGrade: LetterGrade) =>
  LETTER_GRADE_BADGE_TEXT[kind][letterGrade];

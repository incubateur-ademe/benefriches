import type { LetterGrade } from "shared";

import type { ClassValue } from "@/shared/views/clsx";

export const LETTER_GRADE_COLORS = {
  A: {
    bgLightColor: "bg-development-score-grade-a-light",
    bgColor: "bg-development-score-grade-a",
    textColor: "text-white",
  },
  B: {
    bgLightColor: "bg-development-score-grade-b-light",
    bgColor: "bg-development-score-grade-b",
    textColor: "text-white",
  },
  C: {
    bgLightColor: "bg-development-score-grade-c-light",
    bgColor: "bg-development-score-grade-c",
    textColor: "text-text-dark",
  },
  D: {
    bgLightColor: "bg-development-score-grade-d-light",
    bgColor: "bg-development-score-grade-d",
    textColor: "text-white",
  },
  E: {
    bgLightColor: "bg-development-score-grade-e-light",
    bgColor: "bg-development-score-grade-e",
    textColor: "text-white",
  },
} as const satisfies Record<
  LetterGrade,
  {
    bgLightColor: ClassValue;
    bgColor: ClassValue;
    textColor: ClassValue;
  }
>;

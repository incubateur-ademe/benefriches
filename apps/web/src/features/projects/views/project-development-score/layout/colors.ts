import type { LetterGrade } from "shared";

import type { ClassValue } from "@/shared/views/clsx";

export const LETTER_GRADE_COLORS = {
  A: {
    bgLightColor: "bg-[#03814114]",
    bgColor: "bg-[#038141]",
    textColor: "text-[#ffffff]",
  },
  B: {
    bgLightColor: "bg-[#85bb2f1a]",
    bgColor: "bg-[#85bb2f]",
    textColor: "text-[#ffffff]",
  },
  C: {
    bgLightColor: "bg-[#fecb021a]",
    bgColor: "bg-[#fecb02]",
    textColor: "text-[#161616]",
  },
  D: {
    bgLightColor: "bg-[#ee81001a]",
    bgColor: "bg-[#ee8100]",
    textColor: "text-[#ffffff]",
  },
  E: {
    bgLightColor: "bg-[#e63e111a]",
    bgColor: "bg-[#e63e11]",
    textColor: "text-[#ffffff]",
  },
} as const satisfies Record<
  LetterGrade,
  {
    bgLightColor: ClassValue;
    bgColor: ClassValue;
    textColor: ClassValue;
  }
>;

import type { LetterGrade } from "shared";

import classNames from "@/shared/views/clsx";

import { LETTER_GRADE_COLORS } from "./colors";
import { getLetterGradeBadgeText } from "./gradeLabels";

type MetricCardProps = {
  letterGrade: LetterGrade;
  badgeText?: string;
};

function GradeTextBadge({ letterGrade, badgeText }: MetricCardProps) {
  const { textColor: badgeTextColor, bgColor: bgBagdeColor } = LETTER_GRADE_COLORS[letterGrade];

  return (
    <span
      className={classNames(
        "font-bold rounded-lg text-xs py-1 px-2 shrink-0 whitespace-nowrap",
        bgBagdeColor,
        badgeTextColor,
      )}
    >
      {badgeText ?? getLetterGradeBadgeText("qualitative", letterGrade)}
    </span>
  );
}

export default GradeTextBadge;

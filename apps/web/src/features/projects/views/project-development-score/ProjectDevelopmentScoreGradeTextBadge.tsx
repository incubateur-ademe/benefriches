import type { LetterGrade } from "shared";

import classNames from "@/shared/views/clsx";

import { LETTER_GRADE_COLORS } from "./colors";

type MetricCardProps = {
  letterGrade: LetterGrade;
  badgeText?: string;
};

const getLetterGradeBadgeText = (letterGrade: LetterGrade) => {
  switch (letterGrade) {
    case "A":
      return "Nettement amélioré";
    case "B":
      return "Amélioré";
    case "C":
      return "Neutre";
    case "D":
      return "Dégradé";
    case "E":
      return "Nettement dégradé";
  }
};
function GradeTextBadge({ letterGrade, badgeText }: MetricCardProps) {
  const label = getLetterGradeBadgeText(letterGrade);
  const { textColor: badgeTextColor, bgColor: bgBagdeColor } = LETTER_GRADE_COLORS[letterGrade];

  return (
    <span
      className={classNames(
        "font-bold rounded-lg text-xs py-1 px-2 shrink-0 whitespace-nowrap",
        bgBagdeColor,
        badgeTextColor,
      )}
    >
      {badgeText ?? label}
    </span>
  );
}

export default GradeTextBadge;

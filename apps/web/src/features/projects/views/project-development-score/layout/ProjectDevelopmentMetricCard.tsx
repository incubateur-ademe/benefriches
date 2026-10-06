import type { LetterGrade } from "shared";

import classNames from "@/shared/views/clsx";

import GradeTextBadge from "./ProjectDevelopmentScoreGradeTextBadge";
import { LETTER_GRADE_COLORS } from "./colors";

type MetricCardProps = {
  emoji: string;
  title: string;
  letterGrade: LetterGrade;
  description: React.ReactNode;
  badgeText?: string;
};

function MetricCard({ emoji, title, letterGrade, description, badgeText }: MetricCardProps) {
  return (
    <div
      className={classNames(
        "p-5 border border-border-grey rounded-2xl min-h-40",
        LETTER_GRADE_COLORS[letterGrade].bgLightColor,
      )}
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <h5 className="text-xl min-w-0 mb-0">
          {emoji} {title}
        </h5>
        <GradeTextBadge letterGrade={letterGrade} badgeText={badgeText} />
      </div>
      <span className="text-sm">{description}</span>
    </div>
  );
}

export default MetricCard;

import type { LetterGrade } from "shared";
import type { Link } from "type-route";

import classNames from "@/shared/views/clsx";

import GradeTextBadge from "./ProjectDevelopmentScoreGradeTextBadge";
import { LETTER_GRADE_COLORS } from "./colors";

type MetricCardProps = {
  emoji: string;
  title: string;
  letterGrade: LetterGrade;
  description: React.ReactNode;
  badgeText?: string;
  linkProps: Link;
};

function MetricCard({
  emoji,
  title,
  letterGrade,
  description,
  badgeText,
  linkProps,
}: MetricCardProps) {
  return (
    <a
      {...linkProps}
      className={classNames(
        "p-5 border border-border-grey hover:border-grey-dark rounded-2xl min-h-40 text-left bg-none",
        "hover:border-current focus:border-current",
        "transition ease-in-out duration-500",
        "flex flex-col group",
        LETTER_GRADE_COLORS[letterGrade].bgLightColor,
      )}
    >
      <div className="flex justify-between items-start gap-2 mb-2">
        <h5 className="text-xl min-w-0 mb-0">
          {emoji} {title}
        </h5>
        <GradeTextBadge letterGrade={letterGrade} badgeText={badgeText} />
      </div>
      <span className="text-sm grow">{description}</span>
      <div className="transition ease-in-out duration-500 fr-link underline text-sm invisible group-hover:visible group-focus:visible">
        En savoir plus
      </div>
    </a>
  );
}

export default MetricCard;

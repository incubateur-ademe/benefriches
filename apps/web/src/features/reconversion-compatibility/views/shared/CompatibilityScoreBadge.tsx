import classNames from "@/shared/views/clsx";

import {
  getCompatibilityScoreBackgroundColor,
  getTextForCompatibilityScore,
} from "../../core/score";

type Props = {
  score: number;
  compact?: boolean;
};

export default function CompatibilityScoreBadge({ score, compact }: Props) {
  return (
    <div
      className={classNames(
        getCompatibilityScoreBackgroundColor(score),
        "py-2 px-4 inline rounded-lg",
      )}
    >
      <span className={classNames(compact ? "text-xs" : "text-lg", "text-black font-bold")}>
        {score.toFixed(0)}%
      </span>
      <span className="border-l border-black h-full opacity-25 mx-2" />
      <span className="text-xs text-black font-bold align-middle">
        {getTextForCompatibilityScore(score)}
      </span>
    </div>
  );
}

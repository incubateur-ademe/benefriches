import type { MutabilityUsage } from "shared";

import CompatibilityScoreBadge from "@/features/reconversion-compatibility/views/shared/CompatibilityScoreBadge";
import RankBadge from "@/features/reconversion-compatibility/views/shared/RankBadge";
import { getUsagePictogramSrc } from "@/features/reconversion-compatibility/views/shared/getUsagePictogramSrc";
import { getMutabilityUsageDisplayName } from "@/shared/core/reconversionCompatibility";

type Props = {
  usage: MutabilityUsage;
  score: number;
  rank: number;
};

export default function CompatibilityResultRow({ usage, score, rank }: Props) {
  return (
    <article className="flex items-center gap-4 py-3">
      <RankBadge rank={rank} />
      <img
        src={getUsagePictogramSrc(usage)}
        height={44}
        className="h-11 w-auto"
        aria-hidden="true"
        alt=""
      />
      <h4 className="flex-1 text-sm mb-0">{getMutabilityUsageDisplayName(usage)}</h4>
      <CompatibilityScoreBadge score={score} />
    </article>
  );
}

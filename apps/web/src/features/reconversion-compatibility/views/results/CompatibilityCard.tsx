import type { MutabilityUsage } from "shared";

import { getMutabilityUsageDisplayName } from "@/shared/core/reconversionCompatibility";

import CompatibilityScoreBadge from "../shared/CompatibilityScoreBadge";
import RankBadge from "../shared/RankBadge";
import { getUsagePictogramSrc } from "../shared/getUsagePictogramSrc";

type Props = {
  usage: MutabilityUsage;
  score: number;
  rank: number;
};

export default function CompatibilityCard({ usage, score, rank }: Props) {
  return (
    <article
      key={usage}
      className="relative flex-1 flex flex-col justify-between border border-border-grey rounded-xl py-8 px-8"
    >
      <div className="absolute top-4 left-4">
        <RankBadge rank={rank} />
      </div>
      <div className="text-center">
        <div className="mb-4" aria-hidden="true">
          <img src={getUsagePictogramSrc(usage)} width={80} height={80} alt="" />
        </div>
        <h3 className="mb-4 text-lg">{getMutabilityUsageDisplayName(usage)}</h3>

        <CompatibilityScoreBadge score={score} />
      </div>
    </article>
  );
}

import { MutabilityUsage } from "shared";

import { getMutabilityUsageDisplayName } from "@/shared/core/reconversionCompatibility";
import classNames from "@/shared/views/clsx";

import {
  getCompatibilityScoreBackgroundColor,
  getTextForCompatibilityScore,
} from "../../core/score";

const getUsagePictogramSrc = (usage: MutabilityUsage): string => {
  switch (usage) {
    case "residentiel":
      return "/img/pictograms/mutability-usages/residential.svg";
    case "equipements":
      return "/img/pictograms/mutability-usages/public-facilities.svg";
    case "culture":
      return "/img/pictograms/mutability-usages/culture-and-tourism.svg";
    case "tertiaire":
      return "/img/pictograms/mutability-usages/offices.svg";
    case "industrie":
      return "/img/pictograms/mutability-usages/industry.svg";
    case "renaturation":
      return "/img/pictograms/mutability-usages/renaturation.svg";
    case "photovoltaique":
      return "/img/pictograms/mutability-usages/photovoltaic.svg";
    default:
      return "";
  }
};

const getRankColor = (rank: number): string => {
  switch (rank) {
    case 1:
      return "bg-[#FFDA7B] text-black";
    case 2:
      return "bg-[#D9D9D9] text-black";
    case 3:
      return "bg-[#EAB078] text-black";
    default:
      return "bg-gray-200 text-black";
  }
};

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
      <div
        className={classNames(
          getRankColor(rank),
          "text-xl flex justify-center items-center font-bold rounded-full h-12 w-12",
          "absolute top-4 left-4",
        )}
      >
        {rank}
      </div>
      <div className="text-center">
        <div className="mb-4" aria-hidden="true">
          <img src={getUsagePictogramSrc(usage)} width={80} height={80} alt="" />
        </div>
        <h3 className="mb-4 text-lg">{getMutabilityUsageDisplayName(usage)}</h3>

        <div
          className={classNames(
            getCompatibilityScoreBackgroundColor(score),
            "py-2 px-4 inline mx-auto rounded-lg",
          )}
        >
          <span className="text-lg text-black font-bold">{score.toFixed(0)}%</span>
          <span className="border-l border-black h-full opacity-25 mx-2" />
          <span className="text-xs text-black font-bold align-middle">
            {getTextForCompatibilityScore(score)}
          </span>
        </div>
      </div>
    </article>
  );
}

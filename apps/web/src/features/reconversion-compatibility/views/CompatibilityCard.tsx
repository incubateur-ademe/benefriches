import Button from "@codegouvfr/react-dsfr/Button";

import classNames from "@/shared/views/clsx";

import { MutabilityUsage } from "../core/reconversionCompatibilityEvaluation.reducer";

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

const getScoreBackgroundColor = (score: number): string => {
  if (score >= 70) return "bg-success-ultralight";
  if (score >= 60) return "bg-success-ultralight";
  if (score >= 45) return "bg-warning-ultralight";
  return "bg-red-600";
};

const getScoreLabel = (score: number): string => {
  if (score >= 70) return "Très favorable";
  if (score >= 60) return "Favorable";
  if (score >= 45) return "Correct";
  return "Défavorable";
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

const getMutabilityUsageDisplayName = (usage: MutabilityUsage): string => {
  return {
    culture: "Lieu culturel ou touristique",
    renaturation: "Espace de nature",
    equipements: "Équipements publics",
    tertiaire: "Bureaux",
    residentiel: "Habitations et commerces de proximité",
    photovoltaique: "Centrale photovoltaïque",
    industrie: "Zone industrielle ou logistique",
  }[usage];
};

type Props = {
  usage: MutabilityUsage;
  score: number;
  rank: number;
  onDiscoverImpactsClick: () => void;
};

export default function CompatibilityCard({ usage, score, rank, onDiscoverImpactsClick }: Props) {
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
      <div className="text-center mb-4">
        <div className="mb-4" aria-hidden="true">
          <img src={getUsagePictogramSrc(usage)} width={80} height={80} alt="" />
        </div>
        <h3 className="mb-4 text-lg">{getMutabilityUsageDisplayName(usage)}</h3>

        <div
          className={classNames(
            getScoreBackgroundColor(score),
            "py-2 px-4 inline mx-auto rounded-lg",
          )}
        >
          <span className="text-lg text-black font-bold">{score.toFixed(0)}%</span>
          <span className="border-l border-black h-full opacity-25 mx-2" />
          <span className="text-xs text-black font-bold align-middle">{getScoreLabel(score)}</span>
        </div>
      </div>
      <div className="text-center">
        <Button
          priority="primary"
          size="small"
          onClick={() => {
            onDiscoverImpactsClick();
          }}
        >
          Découvrir les impacts
        </Button>
      </div>
    </article>
  );
}

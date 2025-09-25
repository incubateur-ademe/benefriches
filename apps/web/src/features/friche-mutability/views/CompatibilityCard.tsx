import Button from "@codegouvfr/react-dsfr/Button";

import Badge from "@/shared/views/components/Badge/Badge";

import { MutabilityUsage } from "../core/fricheMutability.reducer";

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

const getScoreColor = (score: number): string => {
  if (score >= 80) return "text-green-700";
  if (score >= 60) return "text-yellow-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
};

const getScoreLabel = (score: number): string => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Favorable";
  if (score >= 40) return "Modéré";
  return "Faible";
};

const getMutabilityUsageDisplayName = (usage: MutabilityUsage): string => {
  return {
    culture: "Lieu culturel ou touristique",
    renaturation: "Espace de nature",
    equipements: "Équipements publics",
    tertiaire: "Bureaux",
    residentiel: "Habitations et commerces",
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
      className="flex-1 flex flex-col justify-between border-1 border-border-grey rounded-xl py-8 px-8"
    >
      <div>
        <div className="mb-4" aria-hidden="true">
          <img src={getUsagePictogramSrc(usage)} width={100} height={100} alt="" />
        </div>
        <div className="flex items-center gap-2 mb-6">
          <h3 className="mb-0">{getMutabilityUsageDisplayName(usage)}</h3>
          <Badge small style="blue">
            #{rank}
          </Badge>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <h4 className="text-sm text-gray-600 font-normal mb-0">Indice de compatibilité :</h4>
          <span className={`text-sm font-bold ${getScoreColor(score)}`}>
            {score.toFixed(0)}% ({getScoreLabel(score)})
          </span>
        </div>
      </div>
      <div>
        <Button
          priority="primary"
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

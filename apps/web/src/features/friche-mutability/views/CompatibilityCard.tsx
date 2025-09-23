import Button from "@codegouvfr/react-dsfr/Button";

import Badge from "@/shared/views/components/Badge/Badge";

import { MutabilityUsage } from "../core/fricheMutability.reducer";

const getUsageIcon = (usage: MutabilityUsage): string => {
  switch (usage) {
    case "residentiel":
      return "🏠";
    case "equipements":
      return "🏛️";
    case "culture":
      return "🎭";
    case "tertiaire":
      return "🏢";
    case "industrie":
      return "🏭";
    case "renaturation":
      return "🌳";
    case "photovoltaique":
      return "☀️";
    default:
      return "❓";
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
    culture: "Culture, tourisme",
    renaturation: "Renaturation",
    equipements: "Équipements publics",
    tertiaire: "Tertiaire",
    residentiel: "Résidentiel",
    photovoltaique: "Photovoltaïque au sol",
    industrie: "Industrie",
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
    <article key={usage} className="flex-1 border-1 border-border-grey rounded-xl py-8 px-6">
      <span className="text-6xl mb-6 block text-center" aria-hidden="true">
        {getUsageIcon(usage)}
      </span>
      <div className="flex justify-center items-center gap-2 mb-6">
        <Badge small style="blue">
          #{rank}
        </Badge>
        <h3 className="mb-0">{getMutabilityUsageDisplayName(usage)}</h3>
      </div>

      <div className="flex justify-center items-center gap-2 mb-6">
        <h4 className="text-sm text-gray-600 font-normal mb-0">Indice de compatibilité :</h4>
        <span className={`text-sm font-bold ${getScoreColor(score)}`}>
          {score.toFixed(0)}% ({getScoreLabel(score)})
        </span>
      </div>

      <div className="text-center">
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

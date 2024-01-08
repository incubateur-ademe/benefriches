import ImpactCard from "../ImpactCard";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

type Props = {
  impactValue: number;
  ownerName: string;
};

function EconomicResultsCard({ impactValue, ownerName }: Props) {
  return (
    <ImpactCard
      isPositive={impactValue > 0}
      title="💰 Bilan économique"
      impact={`${formatNumberFr(impactValue)} €`}
      text={`pour ${ownerName}`}
    />
  );
}

export default EconomicResultsCard;

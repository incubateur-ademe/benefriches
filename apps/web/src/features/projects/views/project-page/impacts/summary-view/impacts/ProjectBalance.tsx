import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

type Props = {
  economicBalanceTotal: number;
  socioEconomicMonetaryImpactsTotal: number;
  isSuccess: boolean;
  descriptionDisplayMode?: "inline" | "tooltip";
};

const ImpactSummaryProjectBalance = ({
  socioEconomicMonetaryImpactsTotal,
  economicBalanceTotal,
  isSuccess,
  descriptionDisplayMode,
}: Props) => {
  return (
    <KeyImpactIndicatorCard
      type={isSuccess ? "success" : "error"}
      description={`${formatMonetaryImpact(socioEconomicMonetaryImpactsTotal)} d’impacts socio-économiques contre ${formatMonetaryImpact(economicBalanceTotal)} de bilan de l’opération`}
      title={
        isSuccess
          ? "Impacts avec une valeur qui compense le déficit\u00a0💰"
          : "Impacts avec une valeur plus faible que le déficit\u00a0💸"
      }
      descriptionDisplayMode={descriptionDisplayMode}
    />
  );
};

export default ImpactSummaryProjectBalance;

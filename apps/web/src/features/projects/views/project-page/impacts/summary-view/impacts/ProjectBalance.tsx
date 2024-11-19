import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

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
          ? "Les impacts compensent le déficit de l'opération\u00a0💰"
          : "Les impacts ne compensent pas le déficit de l'opération\u00a0💸"
      }
      descriptionDisplayMode={descriptionDisplayMode}
    />
  );
};

export default ImpactSummaryProjectBalance;

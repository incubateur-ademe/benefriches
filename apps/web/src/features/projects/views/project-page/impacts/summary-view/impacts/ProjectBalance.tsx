import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  economicBalanceTotal: number;
  socioEconomicMonetaryImpactsTotal: number;
  isSuccess: boolean;
  onClick?: () => void;
  noDescription?: boolean;
};

const ImpactSummaryProjectBalance = ({
  socioEconomicMonetaryImpactsTotal,
  economicBalanceTotal,
  isSuccess,
  noDescription,
  onClick,
}: Props) => {
  return (
    <KeyImpactIndicatorCard
      type={isSuccess ? "success" : "error"}
      description={
        noDescription
          ? undefined
          : `${formatMonetaryImpact(socioEconomicMonetaryImpactsTotal)} d’impacts socio-économiques contre ${formatMonetaryImpact(economicBalanceTotal)} de bilan de l’opération`
      }
      title={
        isSuccess
          ? "Les impacts compensent le déficit de l'opération\u00a0💰"
          : "Les impacts ne compensent pas le déficit de l'opération\u00a0💸"
      }
      onClick={onClick}
    />
  );
};

export default ImpactSummaryProjectBalance;

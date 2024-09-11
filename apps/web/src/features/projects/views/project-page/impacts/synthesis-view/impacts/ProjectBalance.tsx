import ImpactSyntheticCard from "../ImpactSyntheticCard";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

type Props = {
  economicBalanceTotal: number;
  socioEconomicMonetaryImpactsTotal: number;
  isSuccess: boolean;
  small?: boolean;
};

const ImpactSynthesisProjectBalance = ({
  socioEconomicMonetaryImpactsTotal,
  economicBalanceTotal,
  isSuccess,
  ...props
}: Props) => {
  return (
    <ImpactSyntheticCard
      {...props}
      type={isSuccess ? "success" : "error"}
      tooltipText={`${formatMonetaryImpact(socioEconomicMonetaryImpactsTotal)} d’impacts socio-économiques contre ${formatMonetaryImpact(economicBalanceTotal)} de bilan de l’opération`}
      text={
        isSuccess
          ? "Impacts avec une valeur qui compense le déficit\u00a0💰"
          : "Impacts avec une valeur plus faible que le déficit\u00a0💸"
      }
    />
  );
};

export default ImpactSynthesisProjectBalance;

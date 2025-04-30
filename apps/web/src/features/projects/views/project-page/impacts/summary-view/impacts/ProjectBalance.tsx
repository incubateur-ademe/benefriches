import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import { ControlButtonProps } from "../../impact-description-modals/ImpactModalDescriptionContext";
import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  economicBalanceTotal: number;
  socioEconomicMonetaryImpactsTotal: number;
  isSuccess: boolean;
  buttonProps: ControlButtonProps;
  noDescription?: boolean;
};

const ImpactSummaryProjectBalance = ({
  socioEconomicMonetaryImpactsTotal,
  economicBalanceTotal,
  isSuccess,
  noDescription,
  buttonProps,
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
      buttonProps={buttonProps}
    />
  );
};

export default ImpactSummaryProjectBalance;

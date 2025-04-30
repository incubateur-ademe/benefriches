import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  value: number;
  buttonProps: {
    "data-fr-opened": boolean;
    "aria-controls": string;
  };
  noDescription?: boolean;
};

const ImpactSummaryLocalPropertyValueIncrease = ({ value, buttonProps, noDescription }: Props) => {
  return (
    <KeyImpactIndicatorCard
      type="success"
      description={
        noDescription
          ? undefined
          : `${formatMonetaryImpact(value)} de valeur patrimoniale attendue par la reconversion de la friche`
      }
      title="Un cadre de vie amélioré&nbsp;🏡"
      buttonProps={buttonProps}
    />
  );
};

export default ImpactSummaryLocalPropertyValueIncrease;

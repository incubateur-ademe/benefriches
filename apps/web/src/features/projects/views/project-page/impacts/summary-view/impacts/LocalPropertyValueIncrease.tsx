import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import { ControlButtonProps } from "../../impact-description-modals/ImpactModalDescriptionContext";
import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  value: number;
  buttonProps: ControlButtonProps;
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

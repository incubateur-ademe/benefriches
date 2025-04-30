import { formatNumberFr } from "@/shared/core/format-number/formatNumber";

import { ControlButtonProps } from "../../impact-description-modals/ImpactModalDescriptionContext";
import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  value: number;
  buttonProps: ControlButtonProps;
  noDescription?: boolean;
};

const ImpactSummaryHouseholdsPoweredByRenewableEnergy = ({
  value,
  buttonProps,
  noDescription,
}: Props) => {
  return (
    <KeyImpactIndicatorCard
      type="success"
      description={
        noDescription ? undefined : `${formatNumberFr(value)} nouveaux foyers alimentés en EnR`
      }
      title="+ d’énergies renouvelables&nbsp;⚡"
      buttonProps={buttonProps}
    />
  );
};

export default ImpactSummaryHouseholdsPoweredByRenewableEnergy;

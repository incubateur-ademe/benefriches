import { formatNumberFr } from "@/shared/core/format-number/formatNumber";

import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  value: number;
  buttonProps: {
    "data-fr-opened": boolean;
    "aria-controls": string;
  };
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

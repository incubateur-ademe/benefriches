import { formatNumberFr } from "@/shared/core/format-number/formatNumber";

import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  value: number;
  onClick?: () => void;
  noDescription?: boolean;
};

const ImpactSummaryHouseholdsPoweredByRenewableEnergy = ({
  value,
  onClick,
  noDescription,
}: Props) => {
  return (
    <KeyImpactIndicatorCard
      type="success"
      description={
        noDescription ? undefined : `${formatNumberFr(value)} nouveaux foyers alimentés en EnR`
      }
      title="+ d’énergies renouvelables&nbsp;⚡"
      onClick={onClick}
    />
  );
};

export default ImpactSummaryHouseholdsPoweredByRenewableEnergy;

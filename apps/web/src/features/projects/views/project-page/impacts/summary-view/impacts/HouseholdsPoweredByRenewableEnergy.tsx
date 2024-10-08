import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  value: number;
  descriptionDisplayMode?: "inline" | "tooltip";
};

const ImpactSummaryHouseholdsPoweredByRenewableEnergy = ({
  value,
  descriptionDisplayMode,
}: Props) => {
  return (
    <KeyImpactIndicatorCard
      type="success"
      description={`${formatNumberFr(value)} nouveaux foyers alimentés en EnR`}
      title="+ d’énergies renouvelables&nbsp;⚡"
      descriptionDisplayMode={descriptionDisplayMode}
    />
  );
};

export default ImpactSummaryHouseholdsPoweredByRenewableEnergy;

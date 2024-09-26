import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

type Props = {
  value: number;
  descriptionDisplayMode?: "inline" | "tooltip";
};

const ImpactSynthesisHouseholdsPoweredByRenewableEnergy = ({
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

export default ImpactSynthesisHouseholdsPoweredByRenewableEnergy;

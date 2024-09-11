import ImpactSyntheticCard from "../ImpactSyntheticCard";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

type Props = {
  value: number;
  small?: boolean;
};

const ImpactSynthesisHouseholdsPoweredByRenewableEnergy = ({ value, ...props }: Props) => {
  return (
    <ImpactSyntheticCard
      {...props}
      type="success"
      tooltipText={`${formatNumberFr(value)} nouveaux foyers alimentés en EnR`}
      text="+ d’énergies renouvelables&nbsp;⚡"
    />
  );
};

export default ImpactSynthesisHouseholdsPoweredByRenewableEnergy;

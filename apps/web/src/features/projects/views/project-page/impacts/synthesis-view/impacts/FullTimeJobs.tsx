import ImpactSyntheticCard from "../ImpactSyntheticCard";

import { formatEvolutionPercentage } from "@/features/projects/views/shared/formatImpactValue";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

type Props = {
  percentageEvolution: number;
  value: number;
  isSuccess: boolean;
  small?: boolean;
};

const ImpactSynthesisFullTimeJobs = ({
  percentageEvolution,
  value,
  isSuccess,
  ...props
}: Props) => {
  if (isSuccess) {
    return (
      <ImpactSyntheticCard
        {...props}
        type="success"
        tooltipText={`${formatNumberFr(value)} emploi équivalent temps plein créé ou maintenu (soit ${formatEvolutionPercentage(percentageEvolution)})`}
        text="+ d’emplois&nbsp;👷"
      />
    );
  }

  return (
    <ImpactSyntheticCard
      {...props}
      type="error"
      tooltipText={`${formatNumberFr(value)} emploi équivalent temps plein perdu (soit ${formatEvolutionPercentage(percentageEvolution)})`}
      text="- d’emplois&nbsp;👷"
    />
  );
};

export default ImpactSynthesisFullTimeJobs;

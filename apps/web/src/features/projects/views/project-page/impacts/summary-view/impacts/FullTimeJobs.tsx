import { formatEvolutionPercentage } from "@/features/projects/views/shared/formatImpactValue";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";

import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  percentageEvolution: number;
  value: number;
  isSuccess: boolean;
  descriptionDisplayMode?: "inline" | "tooltip";
};

const ImpactSummaryFullTimeJobs = ({
  percentageEvolution,
  value,
  isSuccess,
  descriptionDisplayMode,
}: Props) => {
  if (isSuccess) {
    return (
      <KeyImpactIndicatorCard
        type="success"
        description={`${formatNumberFr(value)} emploi équivalent temps plein créé ou maintenu (soit ${formatEvolutionPercentage(percentageEvolution)})`}
        title="+ d’emplois&nbsp;👷"
        descriptionDisplayMode={descriptionDisplayMode}
      />
    );
  }

  return (
    <KeyImpactIndicatorCard
      type="error"
      description={`${formatNumberFr(value)} emploi équivalent temps plein perdu (soit ${formatEvolutionPercentage(percentageEvolution)})`}
      title="- d’emplois&nbsp;👷"
      descriptionDisplayMode={descriptionDisplayMode}
    />
  );
};

export default ImpactSummaryFullTimeJobs;

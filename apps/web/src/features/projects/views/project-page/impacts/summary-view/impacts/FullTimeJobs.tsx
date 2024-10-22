import { formatNumberFr, formatPercentage } from "@/shared/services/format-number/formatNumber";

import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  percentageEvolution: number;
  difference: number;
  isSuccess: boolean;
  descriptionDisplayMode?: "inline" | "tooltip";
};

const ImpactSummaryFullTimeJobs = ({
  percentageEvolution,
  difference,
  isSuccess,
  descriptionDisplayMode,
}: Props) => {
  if (isSuccess) {
    return (
      <KeyImpactIndicatorCard
        type="success"
        description={`${formatNumberFr(difference)} emploi équivalent temps plein créé ou maintenu (soit ${formatPercentage(percentageEvolution)})`}
        title="+ d’emplois&nbsp;👷"
        descriptionDisplayMode={descriptionDisplayMode}
      />
    );
  }

  return (
    <KeyImpactIndicatorCard
      type="error"
      description={`${formatNumberFr(difference)} emploi équivalent temps plein perdu (soit ${formatPercentage(percentageEvolution)})`}
      title="- d’emplois&nbsp;👷"
      descriptionDisplayMode={descriptionDisplayMode}
    />
  );
};

export default ImpactSummaryFullTimeJobs;

import { formatNumberFr, formatPercentage } from "@/shared/core/format-number/formatNumber";

import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  percentageEvolution: number;
  difference: number;
  isSuccess: boolean;
  onClick?: () => void;
  noDescription?: boolean;
};

const ImpactSummaryFullTimeJobs = ({
  percentageEvolution,
  difference,
  isSuccess,
  onClick,
  noDescription,
}: Props) => {
  if (isSuccess) {
    return (
      <KeyImpactIndicatorCard
        type="success"
        description={
          noDescription
            ? undefined
            : `${formatNumberFr(difference)} emploi équivalent temps plein créé ou maintenu (soit ${formatPercentage(percentageEvolution)})`
        }
        title="+ d’emplois&nbsp;👷"
        onClick={onClick}
      />
    );
  }

  return (
    <KeyImpactIndicatorCard
      type="error"
      description={
        noDescription
          ? undefined
          : `${formatNumberFr(difference)} emploi équivalent temps plein perdu (soit ${formatPercentage(percentageEvolution)})`
      }
      title="- d’emplois&nbsp;👷"
      onClick={onClick}
    />
  );
};

export default ImpactSummaryFullTimeJobs;

import { formatNumberFr, formatPercentage } from "@/shared/core/format-number/formatNumber";

import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  percentageEvolution: number;
  difference: number;
  isSuccess: boolean;
  buttonProps: {
    "data-fr-opened": boolean;
    "aria-controls": string;
  };
  noDescription?: boolean;
};

const ImpactSummaryFullTimeJobs = ({
  percentageEvolution,
  difference,
  isSuccess,
  buttonProps,
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
        buttonProps={buttonProps}
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
      buttonProps={buttonProps}
    />
  );
};

export default ImpactSummaryFullTimeJobs;

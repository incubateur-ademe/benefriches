import { formatNumberFr, formatPercentage } from "@/shared/core/format-number/formatNumber";

import { ControlButtonProps } from "../../impact-description-modals/ImpactModalDescriptionContext";
import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  percentageEvolution: number;
  difference: number;
  isSuccess: boolean;
  buttonProps: ControlButtonProps;
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

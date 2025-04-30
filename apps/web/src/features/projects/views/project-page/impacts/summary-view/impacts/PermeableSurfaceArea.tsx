import { formatPercentage, formatSurfaceArea } from "@/shared/core/format-number/formatNumber";

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

const ImpactSummaryPermeableSurfaceArea = ({
  difference,
  percentageEvolution,
  isSuccess,
  noDescription,
  buttonProps,
}: Props) => {
  return isSuccess ? (
    <KeyImpactIndicatorCard
      type="success"
      description={
        noDescription
          ? undefined
          : `${formatSurfaceArea(difference)} (soit ${formatPercentage(percentageEvolution)}) de sols désimperméabilisés`
      }
      title="+ de sols perméables&nbsp;☔️"
      buttonProps={buttonProps}
    />
  ) : (
    <KeyImpactIndicatorCard
      type="error"
      description={
        noDescription
          ? undefined
          : `${formatSurfaceArea(difference)} (soit ${formatPercentage(percentageEvolution)}) de sols imperméabilisés`
      }
      title="- de sols perméables&nbsp;☔️"
      buttonProps={buttonProps}
    />
  );
};

export default ImpactSummaryPermeableSurfaceArea;

import { formatPercentage, formatSurfaceArea } from "@/shared/core/format-number/formatNumber";

import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  percentageEvolution: number;
  decontaminatedSurfaceArea: number;
  forecastContaminatedSurfaceArea: number;
  isSuccess: boolean;
  buttonProps: {
    "data-fr-opened": boolean;
    "aria-controls": string;
  };
  noDescription?: boolean;
};

const ImpactSummaryNonContaminatedSurfaceArea = ({
  percentageEvolution,
  decontaminatedSurfaceArea,
  forecastContaminatedSurfaceArea,
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
          : `${formatSurfaceArea(decontaminatedSurfaceArea)} (soit ${formatPercentage(percentageEvolution)}) de sols dépollués`
      }
      title="Des risques sanitaires réduits&nbsp;☢️"
      buttonProps={buttonProps}
    />
  ) : (
    <KeyImpactIndicatorCard
      type="error"
      description={
        noDescription
          ? undefined
          : `${formatSurfaceArea(forecastContaminatedSurfaceArea)} de sols non dépollués`
      }
      title="des sols encore pollués&nbsp;☢️"
      buttonProps={buttonProps}
    />
  );
};

export default ImpactSummaryNonContaminatedSurfaceArea;

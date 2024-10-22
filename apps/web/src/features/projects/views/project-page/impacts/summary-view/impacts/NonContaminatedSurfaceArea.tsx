import { formatPercentage, formatSurfaceArea } from "@/shared/services/format-number/formatNumber";

import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  percentageEvolution: number;
  decontaminatedSurfaceArea: number;
  forecastContaminatedSurfaceArea: number;
  isSuccess: boolean;
  descriptionDisplayMode?: "inline" | "tooltip";
};

const ImpactSummaryNonContaminatedSurfaceArea = ({
  percentageEvolution,
  decontaminatedSurfaceArea,
  forecastContaminatedSurfaceArea,
  isSuccess,
  descriptionDisplayMode,
}: Props) => {
  return isSuccess ? (
    <KeyImpactIndicatorCard
      type="success"
      description={`${formatSurfaceArea(decontaminatedSurfaceArea)} (soit ${formatPercentage(percentageEvolution)}) de sols dépollués`}
      title="Des risques sanitaires réduits&nbsp;☢️"
      descriptionDisplayMode={descriptionDisplayMode}
    />
  ) : (
    <KeyImpactIndicatorCard
      type="error"
      description={`${formatSurfaceArea(forecastContaminatedSurfaceArea)} de sols non dépollués`}
      title="des sols encore pollués&nbsp;☢️"
      descriptionDisplayMode={descriptionDisplayMode}
    />
  );
};

export default ImpactSummaryNonContaminatedSurfaceArea;

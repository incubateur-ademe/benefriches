import { formatPercentage, formatSurfaceArea } from "@/shared/services/format-number/formatNumber";

import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  percentageEvolution: number;
  difference: number;
  isSuccess: boolean;
  descriptionDisplayMode?: "inline" | "tooltip";
};

const ImpactSummaryPermeableSurfaceArea = ({
  difference,
  percentageEvolution,
  isSuccess,
  descriptionDisplayMode,
}: Props) => {
  return isSuccess ? (
    <KeyImpactIndicatorCard
      type="success"
      description={`${formatSurfaceArea(difference)} (soit ${formatPercentage(percentageEvolution)}) de sols désimperméabilisés`}
      title="+ de sols perméables&nbsp;☔️"
      descriptionDisplayMode={descriptionDisplayMode}
    />
  ) : (
    <KeyImpactIndicatorCard
      type="error"
      description={`${formatSurfaceArea(difference)} (soit ${formatPercentage(percentageEvolution)}) de sols imperméabilisés`}
      title="- de sols perméables&nbsp;☔️"
      descriptionDisplayMode={descriptionDisplayMode}
    />
  );
};

export default ImpactSummaryPermeableSurfaceArea;

import { formatPercentage, formatSurfaceArea } from "@/shared/services/format-number/formatNumber";

import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  percentageEvolution: number;
  decontaminatedSurfaceArea: number;
  forecastContaminatedSurfaceArea: number;
  isSuccess: boolean;
  onClick?: () => void;
  noDescription?: boolean;
};

const ImpactSummaryNonContaminatedSurfaceArea = ({
  percentageEvolution,
  decontaminatedSurfaceArea,
  forecastContaminatedSurfaceArea,
  isSuccess,
  noDescription,
  onClick,
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
      onClick={onClick}
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
      onClick={onClick}
    />
  );
};

export default ImpactSummaryNonContaminatedSurfaceArea;

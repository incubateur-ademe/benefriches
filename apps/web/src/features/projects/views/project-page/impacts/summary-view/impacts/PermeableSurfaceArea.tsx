import { formatPercentage, formatSurfaceArea } from "@/shared/core/format-number/formatNumber";

import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

type Props = {
  percentageEvolution: number;
  difference: number;
  isSuccess: boolean;
  onClick?: () => void;
  noDescription?: boolean;
};

const ImpactSummaryPermeableSurfaceArea = ({
  difference,
  percentageEvolution,
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
          : `${formatSurfaceArea(difference)} (soit ${formatPercentage(percentageEvolution)}) de sols désimperméabilisés`
      }
      title="+ de sols perméables&nbsp;☔️"
      onClick={onClick}
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
      onClick={onClick}
    />
  );
};

export default ImpactSummaryPermeableSurfaceArea;

import KeyImpactIndicatorCard from "../KeyImpactIndicatorCard";

import {
  formatEvolutionPercentage,
  formatSurfaceAreaImpact,
} from "@/features/projects/views/shared/formatImpactValue";

type Props = {
  percentageEvolution: number;
  value: number;
  isSuccess: boolean;
  descriptionDisplayMode?: "inline" | "tooltip";
};

const ImpactSynthesisNonContaminatedSurfaceArea = ({
  percentageEvolution,
  value,
  isSuccess,
  descriptionDisplayMode,
}: Props) => {
  return isSuccess ? (
    <KeyImpactIndicatorCard
      type="success"
      description={`${formatSurfaceAreaImpact(value)} (soit ${formatEvolutionPercentage(percentageEvolution)}) de sols non dépollués`}
      title="Des risques sanitaires réduits&nbsp;☢️"
      descriptionDisplayMode={descriptionDisplayMode}
    />
  ) : (
    <KeyImpactIndicatorCard
      type="error"
      description={`${formatSurfaceAreaImpact(value)} de sols non dépollués`}
      title="des sols encore pollués&nbsp;☢️"
      descriptionDisplayMode={descriptionDisplayMode}
    />
  );
};

export default ImpactSynthesisNonContaminatedSurfaceArea;

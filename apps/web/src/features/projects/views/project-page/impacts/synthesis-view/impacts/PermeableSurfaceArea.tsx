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

const ImpactSynthesisPermeableSurfaceArea = ({
  value,
  percentageEvolution,
  isSuccess,
  descriptionDisplayMode,
}: Props) => {
  return isSuccess ? (
    <KeyImpactIndicatorCard
      type="success"
      description={`${formatSurfaceAreaImpact(value)} (soit ${formatEvolutionPercentage(percentageEvolution)}) de sols désimperméabilisés`}
      title="+ de sols perméables&nbsp;☔️"
      descriptionDisplayMode={descriptionDisplayMode}
    />
  ) : (
    <KeyImpactIndicatorCard
      type="error"
      description={`${formatSurfaceAreaImpact(value)} (soit ${formatEvolutionPercentage(percentageEvolution)}) de sols imperméabilisés`}
      title="- de sols perméables&nbsp;☔️"
      descriptionDisplayMode={descriptionDisplayMode}
    />
  );
};

export default ImpactSynthesisPermeableSurfaceArea;

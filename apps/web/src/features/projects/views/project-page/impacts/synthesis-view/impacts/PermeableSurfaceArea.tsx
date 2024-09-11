import ImpactSyntheticCard from "../ImpactSyntheticCard";

import {
  formatEvolutionPercentage,
  formatSurfaceAreaImpact,
} from "@/features/projects/views/shared/formatImpactValue";

type Props = {
  percentageEvolution: number;
  value: number;
  small?: boolean;
  isSuccess: boolean;
};

const ImpactSynthesisPermeableSurfaceArea = ({
  value,
  percentageEvolution,
  isSuccess,
  ...props
}: Props) => {
  return isSuccess ? (
    <ImpactSyntheticCard
      {...props}
      type="success"
      tooltipText={`${formatSurfaceAreaImpact(value)} (soit ${formatEvolutionPercentage(percentageEvolution)}) de sols désimperméabilisés`}
      text="+ de sols perméables&nbsp;☔️"
    />
  ) : (
    <ImpactSyntheticCard
      {...props}
      type="error"
      tooltipText={`${formatSurfaceAreaImpact(value)} (soit ${formatEvolutionPercentage(percentageEvolution)}) de sols imperméabilisés`}
      text="- de sols perméables&nbsp;☔️"
    />
  );
};

export default ImpactSynthesisPermeableSurfaceArea;

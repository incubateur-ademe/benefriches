import ImpactSyntheticCard from "../ImpactSyntheticCard";

import {
  formatEvolutionPercentage,
  formatSurfaceAreaImpact,
} from "@/features/projects/views/shared/formatImpactValue";

type Props = {
  percentageEvolution: number;
  value: number;
  isSuccess: boolean;
  small?: boolean;
};

const ImpactSynthesisNonContaminatedSurfaceArea = ({
  percentageEvolution,
  value,
  isSuccess,
  ...props
}: Props) => {
  return isSuccess ? (
    <ImpactSyntheticCard
      {...props}
      type="success"
      tooltipText={`${formatSurfaceAreaImpact(value)} (soit ${formatEvolutionPercentage(percentageEvolution)}) de sols non dépollués`}
      text="Des risques sanitaires réduits&nbsp;☢️"
    />
  ) : (
    <ImpactSyntheticCard
      {...props}
      type="error"
      tooltipText={`${formatSurfaceAreaImpact(value)} de sols non dépollués`}
      text="des sols encore pollués&nbsp;☢️"
    />
  );
};

export default ImpactSynthesisNonContaminatedSurfaceArea;

import { BuildingsUseSurfaceAreaDistribution } from "./living-and-activity-spaces/buildingsUse";

const JOBS_RATIO_PER_GROUND_FLOOR_RETAIL_SQUARE_METER_PER_YEAR = 0.044;
export const computeDefaultOperationsFullTimeJobsFromBuildingsAreaDistribution = (
  buildingsFloorAreaDistribution: BuildingsUseSurfaceAreaDistribution,
) => {
  if (!buildingsFloorAreaDistribution.GROUND_FLOOR_RETAIL) {
    return undefined;
  }
  return (
    JOBS_RATIO_PER_GROUND_FLOOR_RETAIL_SQUARE_METER_PER_YEAR *
    (buildingsFloorAreaDistribution.GROUND_FLOOR_RETAIL ?? 0)
  );
};

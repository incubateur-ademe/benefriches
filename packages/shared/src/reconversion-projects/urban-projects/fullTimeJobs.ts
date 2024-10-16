import { BuildingFloorAreaUsageDistribution } from "../urbanProject";

const JOBS_RATIO_PER_GROUND_FLOOR_RETAIL_SQUARE_METER_PER_YEAR = 0.044;
export const computeDefaultOperationsFullTimeJobsFromBuildingsAreaDistribution = (
  buildingsFloorAreaDistribution: BuildingFloorAreaUsageDistribution,
) => {
  return (
    JOBS_RATIO_PER_GROUND_FLOOR_RETAIL_SQUARE_METER_PER_YEAR *
    (buildingsFloorAreaDistribution.GROUND_FLOOR_RETAIL ?? 0)
  );
};

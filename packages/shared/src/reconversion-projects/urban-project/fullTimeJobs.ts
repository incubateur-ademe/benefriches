import { roundTo1Digit } from "../../services";
import { BuildingsUseSurfaceAreaDistribution } from "./spaces/living-and-activity-spaces/buildingsUse";

const JOBS_RATIO_PER_LOCAL_STORE_SQUARE_METER_PER_YEAR = 0.044;
export const computeDefaultOperationsFullTimeJobsFromBuildingsAreaDistribution = (
  buildingsFloorAreaDistribution: BuildingsUseSurfaceAreaDistribution,
) => {
  if (!buildingsFloorAreaDistribution.LOCAL_STORE) {
    return undefined;
  }
  return roundTo1Digit(
    JOBS_RATIO_PER_LOCAL_STORE_SQUARE_METER_PER_YEAR *
      (buildingsFloorAreaDistribution.LOCAL_STORE ?? 0),
  );
};

import { roundTo1Digit } from "../../services";
import { BuildingsUseDistribution } from "./uses/urbanProjectUse";

const JOBS_RATIO_PER_LOCAL_STORE_SQUARE_METER_PER_YEAR = 0.044;
export const computeDefaultOperationsFullTimeJobsFromBuildingsAreaDistribution = (
  buildingsFloorAreaDistribution: BuildingsUseDistribution,
) => {
  if (!buildingsFloorAreaDistribution.LOCAL_STORE) {
    return undefined;
  }
  return roundTo1Digit(
    JOBS_RATIO_PER_LOCAL_STORE_SQUARE_METER_PER_YEAR *
      (buildingsFloorAreaDistribution.LOCAL_STORE ?? 0),
  );
};

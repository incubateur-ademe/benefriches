import type { BuildingsUseDistribution } from "../../../reconversion-projects";
import type { AccessToLocalServicesIndicatorMetrics } from "../developmentScore.types";
import { filterBuildingsUses } from "../readFeatures.helpers";
import type { NullableIndicatorScore } from "../scoring.helpers";

const LOCAL_SERVICES_BUILDINGS: Set<keyof BuildingsUseDistribution> = new Set([
  "LOCAL_STORE",
  "LOCAL_SERVICES",
]);

export const getAccessToLocalServicesScore = (
  buildingsUseDistribution: BuildingsUseDistribution,
): NullableIndicatorScore<AccessToLocalServicesIndicatorMetrics> => {
  const matchingBuildingsUses = filterBuildingsUses(
    buildingsUseDistribution,
    LOCAL_SERVICES_BUILDINGS,
  );
  if (matchingBuildingsUses.length === 0)
    return {
      letterGrade: undefined,
      metrics: { matchingBuildingsUses },
    };

  return {
    letterGrade: matchingBuildingsUses.length > 1 ? "A" : "B",
    metrics: { matchingBuildingsUses },
  };
};

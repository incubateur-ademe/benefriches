import type { BuildingsUseDistribution } from "../../../reconversion-projects";
import type { AccessToHealthCareIndicatorMetrics } from "../developmentScore.types";
import { filterBuildingsUses } from "../readFeatures.helpers";
import type { NullableIndicatorScore } from "../scoring.helpers";

const HEALTH_RELATED_BUILDINGS: Set<keyof BuildingsUseDistribution> = new Set([
  "LOCAL_HEALTH_SERVICE",
  "MEDICAL_SOCIAL_FACILITY",
  "HOSPITAL",
]);

export const getAccessToHealthCareScore = (
  buildingsUseDistribution: BuildingsUseDistribution,
): NullableIndicatorScore<AccessToHealthCareIndicatorMetrics> => {
  const matchingBuildingsUses = filterBuildingsUses(
    buildingsUseDistribution,
    HEALTH_RELATED_BUILDINGS,
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

import type { BuildingsUseDistribution } from "../../../reconversion-projects";
import type { AccessToHealthCareIndicator } from "../developmentScore.types";
import { filterBuildingsUses } from "../readFeatures.helpers";

const HEALTH_RELATED_BUILDINGS: Set<keyof BuildingsUseDistribution> = new Set([
  "LOCAL_HEALTH_SERVICE",
  "MEDICAL_SOCIAL_FACILITY",
  "HOSPITAL",
]);

export const getAccessToHealthCareScore = (
  buildingsUseDistribution?: BuildingsUseDistribution,
): AccessToHealthCareIndicator => {
  if (!buildingsUseDistribution) {
    return undefined;
  }
  const matchingBuildingsUses = filterBuildingsUses(
    buildingsUseDistribution,
    HEALTH_RELATED_BUILDINGS,
  );
  if (matchingBuildingsUses.length === 0) return undefined;

  return {
    letterGrade: matchingBuildingsUses.length > 1 ? "A" : "B",
    metrics: { matchingBuildingsUses },
  };
};

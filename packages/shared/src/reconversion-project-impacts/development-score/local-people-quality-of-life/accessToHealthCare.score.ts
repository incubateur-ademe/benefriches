import type { BuildingsUseDistribution } from "../../../reconversion-projects";
import { type BuildingUseSurface, filterBuildingsUses } from "../readFeatures.helpers";
import type { ItemScoreResult } from "../scoring.helpers";

const HEALTH_RELATED_BUILDINGS: Set<keyof BuildingsUseDistribution> = new Set([
  "LOCAL_HEALTH_SERVICE",
  "MEDICAL_SOCIAL_FACILITY",
  "HOSPITAL",
]);

export const getAccessToHealthCareScore = (
  buildingsUseDistribution?: BuildingsUseDistribution,
): ItemScoreResult<{ matchingBuildingsUses: BuildingUseSurface[] }> => {
  if (!buildingsUseDistribution) {
    return undefined;
  }
  const matchingBuildingsUses = filterBuildingsUses(
    buildingsUseDistribution,
    HEALTH_RELATED_BUILDINGS,
  );
  if (matchingBuildingsUses.length === 0) return undefined;

  return {
    letterScore: matchingBuildingsUses.length > 1 ? "A" : "B",
    metrics: { matchingBuildingsUses },
  };
};

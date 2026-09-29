import type { BuildingsUseDistribution } from "../../../reconversion-projects";
import { type BuildingUseSurface, filterBuildingsUses } from "../readFeatures.helpers";
import type { ItemScoreResult } from "../scoring.helpers";

const LOCAL_SERVICES_BUILDINGS: Set<keyof BuildingsUseDistribution> = new Set([
  "LOCAL_STORE",
  "LOCAL_SERVICES",
]);

export const getAccessToLocalServicesScore = (
  buildingsUseDistribution?: BuildingsUseDistribution,
): ItemScoreResult<{ matchingBuildingsUses: BuildingUseSurface[] }> => {
  if (!buildingsUseDistribution) {
    return undefined;
  }
  const matchingBuildingsUses = filterBuildingsUses(
    buildingsUseDistribution,
    LOCAL_SERVICES_BUILDINGS,
  );
  if (matchingBuildingsUses.length === 0) return undefined;

  return {
    letterScore: matchingBuildingsUses.length > 1 ? "A" : "B",
    metrics: { matchingBuildingsUses },
  };
};

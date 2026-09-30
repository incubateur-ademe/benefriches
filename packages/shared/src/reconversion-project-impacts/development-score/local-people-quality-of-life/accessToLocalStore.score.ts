import type { BuildingsUseDistribution } from "../../../reconversion-projects";
import { type BuildingUseSurface, filterBuildingsUses } from "../readFeatures.helpers";
import type { ScoredMetrics } from "../scoring.helpers";

const LOCAL_SERVICES_BUILDINGS: Set<keyof BuildingsUseDistribution> = new Set([
  "LOCAL_STORE",
  "LOCAL_SERVICES",
]);

export const getAccessToLocalServicesScore = (
  buildingsUseDistribution?: BuildingsUseDistribution,
): ScoredMetrics<{ matchingBuildingsUses: BuildingUseSurface[] }> => {
  if (!buildingsUseDistribution) {
    return undefined;
  }
  const matchingBuildingsUses = filterBuildingsUses(
    buildingsUseDistribution,
    LOCAL_SERVICES_BUILDINGS,
  );
  if (matchingBuildingsUses.length === 0) return undefined;

  return {
    letterGrade: matchingBuildingsUses.length > 1 ? "A" : "B",
    metrics: { matchingBuildingsUses },
  };
};

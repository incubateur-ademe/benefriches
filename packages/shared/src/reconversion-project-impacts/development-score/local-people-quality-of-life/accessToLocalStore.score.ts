import type { BuildingsUseDistribution } from "../../../reconversion-projects";
import type { AccessToLocalServicesIndicator } from "../developmentScore.types";
import { filterBuildingsUses } from "../readFeatures.helpers";

const LOCAL_SERVICES_BUILDINGS: Set<keyof BuildingsUseDistribution> = new Set([
  "LOCAL_STORE",
  "LOCAL_SERVICES",
]);

export const getAccessToLocalServicesScore = (
  buildingsUseDistribution?: BuildingsUseDistribution,
): AccessToLocalServicesIndicator => {
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

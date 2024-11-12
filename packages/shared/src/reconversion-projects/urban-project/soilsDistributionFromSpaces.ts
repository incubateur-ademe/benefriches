import { typedObjectEntries } from "../../object-entries";
import { SoilsDistribution } from "../../soils";
import { getSoilTypeForSpace, SpacesDistribution } from "./urbanProject";

export const computeSoilsDistributionFromSpaces = (
  spacesDistribution: SpacesDistribution,
): SoilsDistribution => {
  const soilsDistribution: SoilsDistribution = {};
  typedObjectEntries(spacesDistribution).forEach(([space, surfaceArea]) => {
    if (!surfaceArea) return;
    const relatedSoilType = getSoilTypeForSpace(space);
    const existingSurfaceArea = soilsDistribution[relatedSoilType];
    soilsDistribution[relatedSoilType] = existingSurfaceArea
      ? existingSurfaceArea + surfaceArea
      : surfaceArea;
  });
  return soilsDistribution;
};

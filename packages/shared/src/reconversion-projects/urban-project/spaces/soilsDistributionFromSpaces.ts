import { typedObjectEntries } from "../../../object-entries";
import { SoilsDistribution, SoilType } from "../../../soils";
import { LEGACY_SpacesDistribution, LEGACY_UrbanProjectSpace } from "../urbanProject";

const getSoilTypeForSpace = (space: LEGACY_UrbanProjectSpace): SoilType => {
  switch (space) {
    case "BUILDINGS_FOOTPRINT":
      return "BUILDINGS";
    case "PUBLIC_PARKING_LOT":
    case "PRIVATE_PAVED_ALLEY_OR_PARKING_LOT":
    case "PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS":
      return "IMPERMEABLE_SOILS";
    case "PRIVATE_GARDEN_AND_GRASS_ALLEYS":
    case "PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS":
    case "PUBLIC_GREEN_SPACES":
      return "ARTIFICIAL_GRASS_OR_BUSHES_FILLED";
    case "PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT":
    case "PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS":
      return "MINERAL_SOIL";
  }
};

export const computeSoilsDistributionFromSpaces = (
  spacesDistribution: LEGACY_SpacesDistribution,
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

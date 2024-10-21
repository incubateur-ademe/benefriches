import { typedObjectEntries } from "../../object-entries";
import { BuildingFloorAreaUsageDistribution } from "../urbanProject";

export const DEFAULT_RESALE_RATIO_PER_SQUARE_METERS = {
  RESIDENTIAL: 150,
  GROUND_FLOOR_RETAIL: 140,
  TERTIARY_ACTIVITIES: 90,
  NEIGHBOURHOOD_FACILITIES_AND_SERVICES: 80,
  PUBLIC_FACILITIES: 40,
  OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS: 80,
  SHIPPING_OR_INDUSTRIAL_BUILDINGS: 65,
};

export const computeExpectedPostDevelopmentResaleSellingPriceFromSurfaces = (
  buildingsFloorAreaDistribution: BuildingFloorAreaUsageDistribution,
): number => {
  return typedObjectEntries(buildingsFloorAreaDistribution).reduce(
    (total, [surfaceName, surfaceArea]) => {
      return total + DEFAULT_RESALE_RATIO_PER_SQUARE_METERS[surfaceName] * (surfaceArea ?? 0);
    },
    0,
  );
};

const TENSE_AREA_RESALE_RATIO_PER_SQUARE_METERS = {
  RESIDENTIAL: 295,
  GROUND_FLOOR_RETAIL: 140,
  TERTIARY_ACTIVITIES: 250,
  NEIGHBOURHOOD_FACILITIES_AND_SERVICES: 140,
  PUBLIC_FACILITIES: 140,
  OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS: 40,
  SHIPPING_OR_INDUSTRIAL_BUILDINGS: 65,
};

export const computeExpectedPostDevelopmentResaleSellingPriceFromSurfacesInTenseArea = (
  buildingsFloorAreaDistribution: BuildingFloorAreaUsageDistribution,
): number => {
  return typedObjectEntries(buildingsFloorAreaDistribution).reduce(
    (total, [surfaceName, surfaceArea]) => {
      return total + TENSE_AREA_RESALE_RATIO_PER_SQUARE_METERS[surfaceName] * (surfaceArea ?? 0);
    },
    0,
  );
};

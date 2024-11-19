import { typedObjectEntries } from "../../object-entries";
import {
  BuildingsUse,
  BuildingsUseSurfaceAreaDistribution,
} from "./living-and-activity-spaces/buildingsUse";

type BuildingsUseResaleRatioPerSquareMeters = Record<BuildingsUse, number | undefined>;

export const DEFAULT_RESALE_RATIO_PER_SQUARE_METERS = {
  RESIDENTIAL: 150,
  GROUND_FLOOR_RETAIL: 140,
  TERTIARY_ACTIVITIES: 90,
  NEIGHBOURHOOD_FACILITIES_AND_SERVICES: 80,
  PUBLIC_FACILITIES: 40,
  OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS: 80,
  SHIPPING_OR_INDUSTRIAL_BUILDINGS: 65,
  MULTI_STORY_PARKING: undefined,
  SOCIO_CULTURAL_PLACE: undefined,
  SPORTS_FACILITIES: undefined,
  OTHER: undefined,
} satisfies BuildingsUseResaleRatioPerSquareMeters;

export const computeExpectedPostDevelopmentResaleSellingPriceFromSurfaces = (
  buildingsFloorAreaDistribution: BuildingsUseSurfaceAreaDistribution,
): number => {
  return typedObjectEntries(buildingsFloorAreaDistribution).reduce(
    (total, [surfaceName, surfaceArea]) => {
      const pricePerSquareMeter = DEFAULT_RESALE_RATIO_PER_SQUARE_METERS[surfaceName];
      if (pricePerSquareMeter) {
        return total + pricePerSquareMeter * (surfaceArea ?? 0);
      }
      return 0;
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
  MULTI_STORY_PARKING: undefined,
  SOCIO_CULTURAL_PLACE: undefined,
  SPORTS_FACILITIES: undefined,
  OTHER: undefined,
} satisfies BuildingsUseResaleRatioPerSquareMeters;

export const computeExpectedPostDevelopmentResaleSellingPriceFromSurfacesInTenseArea = (
  buildingsFloorAreaDistribution: BuildingsUseSurfaceAreaDistribution,
): number => {
  return typedObjectEntries(buildingsFloorAreaDistribution).reduce(
    (total, [surfaceName, surfaceArea]) => {
      const pricePerSquareMeter = TENSE_AREA_RESALE_RATIO_PER_SQUARE_METERS[surfaceName];
      if (pricePerSquareMeter) {
        return total + pricePerSquareMeter * (surfaceArea ?? 0);
      }
      return 0;
    },
    0,
  );
};

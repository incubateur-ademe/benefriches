import { typedObjectEntries } from "../../object-entries";
import { roundToInteger } from "../../services";
import { UrbanProjectUseWithBuilding, BuildingsUseDistribution } from "./uses/urbanProjectUse";

type BuildingsUseResaleRatioPerSquareMeters = Record<
  UrbanProjectUseWithBuilding,
  number | undefined
>;

export const DEFAULT_RESALE_RATIO_PER_SQUARE_METERS = {
  RESIDENTIAL: 150,
  LOCAL_STORE: 140,
  OFFICES: 90,
  LOCAL_SERVICES: 80,
  PUBLIC_FACILITIES: 40,
  ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 72.5,
  MULTI_STORY_PARKING: undefined,
  OTHER_CULTURAL_PLACE: undefined,
  SPORTS_FACILITIES: undefined,
  OTHER_BUILDING: undefined,
  // Educational facilities
  KINDERGARTEN_OR_PRIMARY_SCHOOL: undefined,
  SECONDARY_SCHOOL: undefined,
  OTHER_EDUCATIONAL_FACILITY: undefined,
  // Health facilities
  LOCAL_HEALTH_SERVICE: undefined,
  HOSPITAL: undefined,
  MEDICAL_SOCIAL_FACILITY: undefined,
  // Leisure and culture facilities
  CINEMA: undefined,
  MUSEUM: undefined,
  THEATER: undefined,
  RECREATIONAL_FACILITY: undefined,
} satisfies BuildingsUseResaleRatioPerSquareMeters;

export const computeExpectedPostDevelopmentResaleSellingPriceFromSurfaces = (
  buildingsFloorAreaDistribution: BuildingsUseDistribution,
): number => {
  return typedObjectEntries(buildingsFloorAreaDistribution).reduce(
    (total, [surfaceName, surfaceArea]) => {
      const pricePerSquareMeter = DEFAULT_RESALE_RATIO_PER_SQUARE_METERS[surfaceName];
      if (pricePerSquareMeter) {
        return total + roundToInteger(pricePerSquareMeter * (surfaceArea ?? 0));
      }
      return 0;
    },
    0,
  );
};

const TENSE_AREA_RESALE_RATIO_PER_SQUARE_METERS = {
  RESIDENTIAL: 295,
  LOCAL_STORE: 140,
  OFFICES: 250,
  LOCAL_SERVICES: 140,
  PUBLIC_FACILITIES: 140,
  ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 52.5,
  MULTI_STORY_PARKING: undefined,
  OTHER_CULTURAL_PLACE: undefined,
  SPORTS_FACILITIES: undefined,
  OTHER_BUILDING: undefined,
  // Educational facilities
  KINDERGARTEN_OR_PRIMARY_SCHOOL: undefined,
  SECONDARY_SCHOOL: undefined,
  OTHER_EDUCATIONAL_FACILITY: undefined,
  // Health facilities
  LOCAL_HEALTH_SERVICE: undefined,
  HOSPITAL: undefined,
  MEDICAL_SOCIAL_FACILITY: undefined,
  // Leisure and culture facilities
  CINEMA: undefined,
  MUSEUM: undefined,
  THEATER: undefined,
  RECREATIONAL_FACILITY: undefined,
} satisfies BuildingsUseResaleRatioPerSquareMeters;

export const computeExpectedPostDevelopmentResaleSellingPriceFromSurfacesInTenseArea = (
  buildingsFloorAreaDistribution: BuildingsUseDistribution,
): number => {
  return typedObjectEntries(buildingsFloorAreaDistribution).reduce(
    (total, [surfaceName, surfaceArea]) => {
      const pricePerSquareMeter = TENSE_AREA_RESALE_RATIO_PER_SQUARE_METERS[surfaceName];
      if (pricePerSquareMeter) {
        return total + roundToInteger(pricePerSquareMeter * (surfaceArea ?? 0));
      }
      return 0;
    },
    0,
  );
};

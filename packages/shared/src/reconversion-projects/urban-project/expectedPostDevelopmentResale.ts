import { typedObjectEntries } from "../../object-entries";
import { roundToInteger, sumObjectValues } from "../../services";
import type { UrbanProjectUseWithBuilding, BuildingsUseDistribution } from "./uses/urbanProjectUse";

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
      return total;
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
      return total;
    },
    0,
  );
};

export const PERCENT_RATIO_PER_BUILDINGS_TYPE = {
  RESIDENTIAL: 1,
  LOCAL_STORE: 0.93,
  OFFICES: 0.6,
  LOCAL_SERVICES: 0.53,
  PUBLIC_FACILITIES: 0.27,
  ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 0.48,
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

export const computeExpectedBuildingsResalePriceFromRefenceDataAndSurfaces = (props: {
  buildingsFloorAreaDistribution: BuildingsUseDistribution;
  propertyValueMedianPricePerSquareMeters: number;
  buildingFootprintArea: number;
}) => {
  const totalFloorArea = roundToInteger(sumObjectValues(props.buildingsFloorAreaDistribution));
  if (totalFloorArea === 0 || props.buildingFootprintArea === 0) {
    return undefined;
  }

  return typedObjectEntries(props.buildingsFloorAreaDistribution).reduce(
    (total, [surfaceName, surfaceArea = 0]) => {
      const percentRatio = PERCENT_RATIO_PER_BUILDINGS_TYPE[surfaceName] ?? 0.4;
      if (percentRatio !== undefined) {
        const pricePerSquareMeter = percentRatio * props.propertyValueMedianPricePerSquareMeters;
        const surfaceRatio = surfaceArea / totalFloorArea;
        return (
          total + roundToInteger(pricePerSquareMeter * (surfaceRatio * props.buildingFootprintArea))
        );
      }
      return total;
    },
    0,
  );
};

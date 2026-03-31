import { typedObjectEntries, type UrbanZoneLandParcelType } from "shared";

import type { SchematizedAnswerStepId } from "../../urbanZoneSteps";

export const PARCEL_STEP_IDS = {
  COMMERCIAL_ACTIVITY_AREA: {
    soilsDistribution: "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_SOILS_DISTRIBUTION",
    buildingsFloorArea: "URBAN_ZONE_COMMERCIAL_ACTIVITY_AREA_BUILDINGS_FLOOR_AREA",
  },
  PUBLIC_SPACES: {
    soilsDistribution: "URBAN_ZONE_PUBLIC_SPACES_SOILS_DISTRIBUTION",
    buildingsFloorArea: "URBAN_ZONE_PUBLIC_SPACES_BUILDINGS_FLOOR_AREA",
  },
  SERVICED_SURFACE: {
    soilsDistribution: "URBAN_ZONE_SERVICED_SURFACE_SOILS_DISTRIBUTION",
    buildingsFloorArea: "URBAN_ZONE_SERVICED_SURFACE_BUILDINGS_FLOOR_AREA",
  },
  RESERVED_SURFACE: {
    soilsDistribution: "URBAN_ZONE_RESERVED_SURFACE_SOILS_DISTRIBUTION",
    buildingsFloorArea: "URBAN_ZONE_RESERVED_SURFACE_BUILDINGS_FLOOR_AREA",
  },
} as const satisfies Record<
  UrbanZoneLandParcelType,
  { soilsDistribution: SchematizedAnswerStepId; buildingsFloorArea: SchematizedAnswerStepId }
>;

export const getParcelStepIds = <P extends UrbanZoneLandParcelType>(
  parcelType: P,
): (typeof PARCEL_STEP_IDS)[P] => PARCEL_STEP_IDS[parcelType];

export const getParcelTypeFromStepId = (stepId: string): UrbanZoneLandParcelType | undefined => {
  for (const [parcelType, ids] of typedObjectEntries(PARCEL_STEP_IDS)) {
    if (ids.soilsDistribution === stepId || ids.buildingsFloorArea === stepId) {
      return parcelType;
    }
  }
  return undefined;
};

export const getNextParcelType = (
  selectedTypes: UrbanZoneLandParcelType[],
  currentType: UrbanZoneLandParcelType,
): UrbanZoneLandParcelType | undefined => {
  const currentIndex = selectedTypes.indexOf(currentType);
  return currentIndex >= 0 && currentIndex < selectedTypes.length - 1
    ? selectedTypes[currentIndex + 1]
    : undefined;
};

export const getPreviousParcelType = (
  selectedTypes: UrbanZoneLandParcelType[],
  currentType: UrbanZoneLandParcelType,
): UrbanZoneLandParcelType | undefined => {
  const currentIndex = selectedTypes.indexOf(currentType);
  return currentIndex > 0 ? selectedTypes[currentIndex - 1] : undefined;
};

import type { UrbanZoneStepStepperConfig } from "../../urbanZoneStepperConfig";

export const parcelBuildingsFloorAreaStepperConfig = {
  groupId: "SOILS_AND_SPACES",
  label: "Surface de plancher des bâtiments",
  subGroupId: "PARCEL_BUILDINGS_FLOOR_AREA",
} as const satisfies UrbanZoneStepStepperConfig;

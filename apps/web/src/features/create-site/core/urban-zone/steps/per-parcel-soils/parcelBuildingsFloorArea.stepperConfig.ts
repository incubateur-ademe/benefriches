import type { UrbanZoneStepStepperConfig } from "../../step-handlers/urbanZoneStepperConfig";

export const parcelBuildingsFloorAreaStepperConfig = {
  groupId: "SOILS_AND_SPACES",
  label: "Surface de plancher des bâtiments",
} as const satisfies UrbanZoneStepStepperConfig;

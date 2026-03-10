import type { UrbanZoneStepStepperConfig } from "../../../step-handlers/urbanZoneStepperConfig";

export const landParcelsSelectionStepperConfig = {
  groupId: "LAND_PARCELS",
  label: "Sélection des surfaces foncières",
} as const satisfies UrbanZoneStepStepperConfig;

import type { UrbanZoneStepStepperConfig } from "../../step-handlers/urbanZoneStepperConfig";

export const soilsContaminationStepperConfig = {
  groupId: "CONTAMINATION",
  label: "Pollution des sols",
} as const satisfies UrbanZoneStepStepperConfig;

import type { UrbanZoneStepStepperConfig } from "../../step-handlers/urbanZoneStepperConfig";

export const namingStepperConfig = {
  groupId: "NAMING",
  label: "Dénomination du site",
} as const satisfies UrbanZoneStepStepperConfig;

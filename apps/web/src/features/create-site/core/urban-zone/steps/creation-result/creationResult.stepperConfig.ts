import type { UrbanZoneStepStepperConfig } from "../../step-handlers/urbanZoneStepperConfig";

export const creationResultStepperConfig = {
  groupId: "SUMMARY",
  label: "Création du site",
} as const satisfies UrbanZoneStepStepperConfig;

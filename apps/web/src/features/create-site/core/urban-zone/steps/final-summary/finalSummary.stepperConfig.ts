import type { UrbanZoneStepStepperConfig } from "../../step-handlers/urbanZoneStepperConfig";

export const finalSummaryStepperConfig = {
  groupId: "SUMMARY",
  label: "Récapitulatif",
} as const satisfies UrbanZoneStepStepperConfig;

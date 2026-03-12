import type { InfoStepHandler } from "../../step-handlers/stepHandler.type";

export const UrbanZoneCreationResultHandler = {
  stepId: "URBAN_ZONE_CREATION_RESULT",

  getPreviousStepId() {
    return "URBAN_ZONE_FINAL_SUMMARY";
  },
} satisfies InfoStepHandler;

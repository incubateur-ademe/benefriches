import type { InfoStepHandler } from "../../stepHandlerRegistry";

export const UrbanZoneCreationResultHandler = {
  stepId: "URBAN_ZONE_CREATION_RESULT",

  getPreviousStepId() {
    return "URBAN_ZONE_FINAL_SUMMARY";
  },
} satisfies InfoStepHandler;

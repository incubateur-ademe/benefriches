import type { InfoStepHandler } from "../../step-handlers/stepHandler.type";

export const UrbanZoneFinalSummaryHandler = {
  stepId: "URBAN_ZONE_FINAL_SUMMARY",

  getNextStepId() {
    return "URBAN_ZONE_CREATION_RESULT";
  },

  getPreviousStepId() {
    return "URBAN_ZONE_NAMING";
  },
} satisfies InfoStepHandler;

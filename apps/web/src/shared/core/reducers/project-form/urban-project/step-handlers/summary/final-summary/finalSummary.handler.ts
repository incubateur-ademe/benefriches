import type { InfoStepHandler } from "../../stepHandler.type";

export const FinalSummaryHandler = {
  stepId: "URBAN_PROJECT_FINAL_SUMMARY",

  getNextStepId() {
    return "URBAN_PROJECT_CREATION_RESULT";
  },

  getPreviousStepId() {
    return "URBAN_PROJECT_NAMING";
  },
} satisfies InfoStepHandler;

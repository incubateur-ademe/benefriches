import { InfoStepHandler } from "../stepHandler.type";

export const FinalSummaryHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_FINAL_SUMMARY",

  getNextStepId() {
    return "URBAN_PROJECT_CREATION_RESULT";
  },

  getPreviousStepId() {
    return "URBAN_PROJECT_NAMING";
  },
} as const;

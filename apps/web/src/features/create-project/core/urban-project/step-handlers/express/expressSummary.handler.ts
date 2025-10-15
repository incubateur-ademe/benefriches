import { InfoStepHandler } from "../stepHandler.type";

export const ExpressSummaryHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_EXPRESS_SUMMARY",

  getPreviousStepId() {
    return "URBAN_PROJECT_EXPRESS_CATEGORY_SELECTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_EXPRESS_CREATION_RESULT";
  },
} as const;

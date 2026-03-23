import type { InfoStepHandler } from "../../stepHandler.type";

export const ExpressSummaryHandler = {
  stepId: "URBAN_PROJECT_EXPRESS_SUMMARY",

  getPreviousStepId() {
    return "URBAN_PROJECT_EXPRESS_TEMPLATE_SELECTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_EXPRESS_CREATION_RESULT";
  },
} satisfies InfoStepHandler;

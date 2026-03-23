import type { AnswerStepHandler } from "../../stepHandler.type";

export const ExpressTemplateSelectionHandler = {
  stepId: "URBAN_PROJECT_EXPRESS_TEMPLATE_SELECTION",

  getPreviousStepId() {
    return "URBAN_PROJECT_CREATE_MODE_SELECTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_EXPRESS_SUMMARY";
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_EXPRESS_TEMPLATE_SELECTION">;

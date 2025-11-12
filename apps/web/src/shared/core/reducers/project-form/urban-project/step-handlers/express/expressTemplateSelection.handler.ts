import { AnswerStepHandler } from "../stepHandler.type";

export const ExpressTemplateSelectionHandler: AnswerStepHandler<"URBAN_PROJECT_EXPRESS_TEMPLATE_SELECTION"> =
  {
    stepId: "URBAN_PROJECT_EXPRESS_TEMPLATE_SELECTION",

    getPreviousStepId() {
      return "URBAN_PROJECT_CREATE_MODE_SELECTION";
    },

    getNextStepId() {
      return "URBAN_PROJECT_EXPRESS_SUMMARY";
    },
  };

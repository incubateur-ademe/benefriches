import { AnswerStepHandler } from "../stepHandler.type";

export const ExpressCategoryHandler: AnswerStepHandler<"URBAN_PROJECT_EXPRESS_CATEGORY_SELECTION"> =
  {
    stepId: "URBAN_PROJECT_EXPRESS_CATEGORY_SELECTION",

    getPreviousStepId() {
      return "URBAN_PROJECT_CREATE_MODE_SELECTION";
    },

    getNextStepId() {
      return "URBAN_PROJECT_EXPRESS_SUMMARY";
    },
  };

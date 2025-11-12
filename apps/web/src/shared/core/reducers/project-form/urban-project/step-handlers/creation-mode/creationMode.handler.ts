import { AnswerStepHandler } from "../stepHandler.type";

export const CreationModeSelectionHandler: AnswerStepHandler<"URBAN_PROJECT_CREATE_MODE_SELECTION"> =
  {
    stepId: "URBAN_PROJECT_CREATE_MODE_SELECTION",

    getNextStepId(_, answers) {
      return answers?.createMode === "express"
        ? "URBAN_PROJECT_EXPRESS_TEMPLATE_SELECTION"
        : "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION";
    },
  };

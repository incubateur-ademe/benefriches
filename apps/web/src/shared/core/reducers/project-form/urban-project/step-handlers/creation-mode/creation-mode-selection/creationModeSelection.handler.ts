import type { AnswerStepHandler } from "../../stepHandler.type";

export const CreationModeSelectionHandler = {
  stepId: "URBAN_PROJECT_CREATE_MODE_SELECTION",

  getNextStepId(_, answers) {
    if (answers?.createMode === "express") {
      return "URBAN_PROJECT_EXPRESS_TEMPLATE_SELECTION";
    }

    return "URBAN_PROJECT_USES_INTRODUCTION";
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_CREATE_MODE_SELECTION">;

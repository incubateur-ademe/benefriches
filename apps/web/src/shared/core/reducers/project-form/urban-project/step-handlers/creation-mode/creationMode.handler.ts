import { BENEFRICHES_ENV } from "@/shared/views/envVars";

import { AnswerStepHandler } from "../stepHandler.type";

export const CreationModeSelectionHandler: AnswerStepHandler<"URBAN_PROJECT_CREATE_MODE_SELECTION"> =
  {
    stepId: "URBAN_PROJECT_CREATE_MODE_SELECTION",

    getNextStepId(_, answers) {
      if (answers?.createMode === "express") {
        return "URBAN_PROJECT_EXPRESS_TEMPLATE_SELECTION";
      }

      return BENEFRICHES_ENV.urbanProjectUsesFlowEnabled
        ? "URBAN_PROJECT_USES_INTRODUCTION"
        : "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION";
    },
  };

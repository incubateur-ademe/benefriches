import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import type { AnswerStepHandler } from "../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA";

export const UsesFloorSurfaceAreaHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,

  getPreviousStepId(context) {
    const selectedUses =
      ReadStateHelper.getStepAnswers(context.stepsState, "URBAN_PROJECT_USES_SELECTION")
        ?.usesSelection ?? [];

    if (selectedUses.includes("PUBLIC_GREEN_SPACES")) {
      return "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA";
    }

    return "URBAN_PROJECT_USES_SELECTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SPACES_INTRODUCTION";
  },
};

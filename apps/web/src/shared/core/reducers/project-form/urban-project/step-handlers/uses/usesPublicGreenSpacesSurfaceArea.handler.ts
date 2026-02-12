import { doesUseIncludeBuildings } from "shared";

import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import type { AnswerStepHandler } from "../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_USES_PUBLIC_GREEN_SPACES_SURFACE_AREA";

export const UsesPublicGreenSpacesSurfaceAreaHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,

  getPreviousStepId() {
    return "URBAN_PROJECT_USES_SELECTION";
  },

  getNextStepId(context) {
    const selectedUses =
      ReadStateHelper.getStepAnswers(context.stepsState, "URBAN_PROJECT_USES_SELECTION")
        ?.usesSelection ?? [];

    const hasBuildingUses = selectedUses.some((use) => doesUseIncludeBuildings(use));

    if (hasBuildingUses) {
      return "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA";
    }

    return "URBAN_PROJECT_SPACES_INTRODUCTION";
  },
};

import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import type { AnswerStepHandler, StepInvalidationRule } from "../../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA";

export const PublicGreenSpacesSurfaceAreaHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,

  getPreviousStepId() {
    return "URBAN_PROJECT_USES_SELECTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SPACES_INTRODUCTION";
  },

  getDependencyRules(context, newAnswers) {
    const previousAnswers = ReadStateHelper.getStepAnswers(context.stepsState, STEP_ID);

    if (previousAnswers?.publicGreenSpacesSurfaceArea === newAnswers.publicGreenSpacesSurfaceArea) {
      return [];
    }

    const rules: StepInvalidationRule[] = [];

    if (
      ReadStateHelper.getStep(
        context.stepsState,
        "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION",
      )
    ) {
      rules.push({
        stepId: "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION",
        action: "invalidate",
      });
    }

    return rules;
  },
};

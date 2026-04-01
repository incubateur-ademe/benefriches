import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import type { AnswerStepHandler, StepInvalidationRule } from "../../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_SPACES_SURFACE_AREA";

export const SpacesSurfaceAreaHandler = {
  stepId: STEP_ID,

  getPreviousStepId() {
    return "URBAN_PROJECT_SPACES_SELECTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SPACES_SOILS_SUMMARY";
  },

  getDependencyRules(context, newAnswers) {
    const previousBuildingsFootprint =
      ReadStateHelper.getStepAnswers(context.stepsState, STEP_ID)?.spacesSurfaceAreaDistribution
        ?.BUILDINGS ?? 0;
    const newBuildingsFootprint = newAnswers.spacesSurfaceAreaDistribution?.BUILDINGS ?? 0;

    if (previousBuildingsFootprint === newBuildingsFootprint) {
      return [];
    }

    const buildingsFootprintToReuseStep = ReadStateHelper.getStep(
      context.stepsState,
      "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
    );

    if (!buildingsFootprintToReuseStep) {
      return [];
    }

    return [
      {
        stepId: "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
        action: "invalidate",
      },
    ] satisfies StepInvalidationRule[];
  },
} satisfies AnswerStepHandler<typeof STEP_ID>;

import { ReadStateHelper } from "../../helpers/readState";
import { BUILDINGS_STEPS, AnswerStepId } from "../../urbanProjectSteps";
import { AnswerStepHandler } from "../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA" as const;

export const UrbanProjectSpacesCategoriesSurfaceAreaHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,

  getStepsToInvalidate(context, newAnswers) {
    const stepsToDelete: AnswerStepId[] = [];
    const stepsToInvalidate: AnswerStepId[] = [];
    const stepsToRecompute: AnswerStepId[] = [];

    const previousDistribution = context.stepsState[STEP_ID]?.payload?.spacesCategoriesDistribution;
    const newDistribution = newAnswers.spacesCategoriesDistribution;

    if (context.stepsState.URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION) {
      if (!newDistribution?.GREEN_SPACES) {
        stepsToDelete.push("URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION");
      } else if (
        previousDistribution?.GREEN_SPACES &&
        previousDistribution.GREEN_SPACES !== newDistribution.GREEN_SPACES
      ) {
        stepsToInvalidate.push("URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION");
      }
    }

    if (context.stepsState.URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION) {
      if (!newDistribution?.PUBLIC_SPACES) {
        stepsToDelete.push("URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION");
      } else if (
        previousDistribution?.PUBLIC_SPACES &&
        previousDistribution.PUBLIC_SPACES !== newDistribution.PUBLIC_SPACES
      ) {
        stepsToInvalidate.push("URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION");
      }
    }

    if (context.stepsState.URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION) {
      if (!newDistribution?.LIVING_AND_ACTIVITY_SPACES) {
        stepsToDelete.push("URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION");
        BUILDINGS_STEPS.forEach((stepId) => {
          if (context.stepsState[stepId]) {
            stepsToDelete.push(stepId);
          }
        });
      } else if (
        previousDistribution?.LIVING_AND_ACTIVITY_SPACES &&
        previousDistribution.LIVING_AND_ACTIVITY_SPACES !==
          newDistribution.LIVING_AND_ACTIVITY_SPACES
      ) {
        stepsToInvalidate.push("URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION");
      }
    }

    if (
      ReadStateHelper.hasLastAnswerFromSystem(
        context.stepsState,
        "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
      )
    ) {
      stepsToRecompute.push("URBAN_PROJECT_EXPENSES_REINSTATEMENT");
    }

    return { deleted: stepsToDelete, invalid: stepsToInvalidate, recomputed: stepsToRecompute };
  },

  getPreviousStepId() {
    return "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION";
  },
};

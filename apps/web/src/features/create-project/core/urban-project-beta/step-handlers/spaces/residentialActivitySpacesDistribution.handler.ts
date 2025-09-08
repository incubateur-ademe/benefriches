import { ReadStateHelper } from "../../helpers/readState";
import { BUILDINGS_STEPS, AnswerStepId } from "../../urbanProjectSteps";
import { AnswerStepHandler } from "../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION" as const;

export const ResidentialAndActivitySpacesDistributionHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,

  getNextStepId(context) {
    const spacesCategoriesDistribution = ReadStateHelper.getStepAnswers(
      context.stepsState,
      "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
    )?.spacesCategoriesDistribution;

    if (spacesCategoriesDistribution?.PUBLIC_SPACES) {
      return "URBAN_PROJECT_PUBLIC_SPACES_INTRODUCTION";
    }

    if (spacesCategoriesDistribution?.GREEN_SPACES) {
      return "URBAN_PROJECT_GREEN_SPACES_INTRODUCTION";
    }

    return "URBAN_PROJECT_SPACES_SOILS_SUMMARY";
  },

  getPreviousStepId() {
    return "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_INTRODUCTION";
  },

  getStepsToInvalidate(context, newAnswers) {
    const stepsToDelete: AnswerStepId[] = [];
    const stepsToInvalidate: AnswerStepId[] = [];
    const stepsToRecompute: AnswerStepId[] = [];

    const previousDistribution =
      context.stepsState.URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION?.payload
        ?.livingAndActivitySpacesDistribution;
    const newDistribution = newAnswers.livingAndActivitySpacesDistribution;

    if (previousDistribution?.BUILDINGS) {
      if (!newDistribution?.BUILDINGS) {
        BUILDINGS_STEPS.forEach((stepId) => {
          if (context.stepsState[stepId]) {
            stepsToDelete.push(stepId);
          }
        });
      } else if (previousDistribution.BUILDINGS !== newDistribution.BUILDINGS) {
        if (context.stepsState.URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA) {
          stepsToInvalidate.push("URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA");
        }
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
} as const;

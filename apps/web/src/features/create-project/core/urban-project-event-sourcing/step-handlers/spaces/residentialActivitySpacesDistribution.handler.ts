import { ReadStateHelper } from "../../urbanProject.helpers";
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

  getStepsToInvalidate(context, previousAnswers, newAnswers) {
    const steps: AnswerStepId[] = [];
    if (
      previousAnswers.livingAndActivitySpacesDistribution?.BUILDINGS !==
      newAnswers.livingAndActivitySpacesDistribution?.BUILDINGS
    ) {
      if (!newAnswers.livingAndActivitySpacesDistribution?.BUILDINGS) {
        BUILDINGS_STEPS.forEach((stepId) => {
          steps.push(stepId);
        });
      }
    }

    if (
      ReadStateHelper.hasLastAnswerFromSystem(
        context.stepsState,
        "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
      )
    ) {
      steps.push("URBAN_PROJECT_EXPENSES_REINSTATEMENT");
    }
    return steps;
  },
} as const;

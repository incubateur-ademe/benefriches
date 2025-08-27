import { FormState } from "../../form-state/formState";
import { BUILDINGS_STEPS, AnswerStepId } from "../../urbanProjectSteps";
import { AnswerStepHandler } from "../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA" as const;

export const UrbanProjectSpacesCategoriesSurfaceAreaHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,

  getStepsToInvalidate(context, previousAnswers, newAnswers) {
    const steps: AnswerStepId[] = [];

    if (
      previousAnswers.spacesCategoriesDistribution?.GREEN_SPACES !==
      newAnswers.spacesCategoriesDistribution?.GREEN_SPACES
    ) {
      if (!newAnswers.spacesCategoriesDistribution?.GREEN_SPACES) {
        steps.push("URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION");
      }
    }

    if (
      previousAnswers.spacesCategoriesDistribution?.PUBLIC_SPACES !==
      newAnswers.spacesCategoriesDistribution?.PUBLIC_SPACES
    ) {
      if (!newAnswers.spacesCategoriesDistribution?.PUBLIC_SPACES) {
        steps.push("URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION");
      }
    }

    if (
      previousAnswers.spacesCategoriesDistribution?.LIVING_AND_ACTIVITY_SPACES !==
      newAnswers.spacesCategoriesDistribution?.LIVING_AND_ACTIVITY_SPACES
    ) {
      if (!newAnswers.spacesCategoriesDistribution?.LIVING_AND_ACTIVITY_SPACES) {
        const hasBuilding = FormState.hasBuildings(context.urbanProjectEventSourcing.events);
        steps.push("URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION");
        if (hasBuilding) {
          BUILDINGS_STEPS.forEach((stepId) => {
            steps.push(stepId);
          });
        }
      }
    }

    if (
      FormState.hasLastAnswerFromSystem(
        context.urbanProjectEventSourcing.events,
        "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
      )
    ) {
      steps.push("URBAN_PROJECT_EXPENSES_REINSTATEMENT");
    }

    return steps;
  },

  getPreviousStepId() {
    return "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION";
  },
};

import { ReadStateHelper } from "../../urbanProject.helpers";
import { BUILDINGS_STEPS, AnswerStepId } from "../../urbanProjectSteps";
import { AnswerStepHandler } from "../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION" as const;

export const UrbanProjectSpacesCategoriesSelectionHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,

  getPreviousStepId() {
    return "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA";
  },

  getStepsToInvalidate(context, previousAnswers, newAnswers) {
    const steps: AnswerStepId[] = [];

    steps.push("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA");

    if (
      previousAnswers.spacesCategories?.includes("GREEN_SPACES") &&
      !newAnswers.spacesCategories?.includes("GREEN_SPACES")
    ) {
      steps.push("URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION");
    }

    if (
      previousAnswers.spacesCategories?.includes("PUBLIC_SPACES") &&
      !newAnswers.spacesCategories?.includes("PUBLIC_SPACES")
    ) {
      steps.push("URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION");
    }

    if (
      previousAnswers.spacesCategories?.includes("LIVING_AND_ACTIVITY_SPACES") &&
      !newAnswers.spacesCategories?.includes("LIVING_AND_ACTIVITY_SPACES")
    ) {
      const hasBuilding = ReadStateHelper.hasBuildings(context.stepsState);
      steps.push("URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION");

      if (hasBuilding) {
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

  getShortcut(context, answers, hasChanged) {
    if (answers.spacesCategories?.length === 1 && answers.spacesCategories[0]) {
      const invalidSteps: AnswerStepId[] =
        answers.spacesCategories[0] === "LIVING_AND_ACTIVITY_SPACES"
          ? ["URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION"]
          : answers.spacesCategories[0] === "PUBLIC_SPACES"
            ? ["URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION"]
            : answers.spacesCategories[0] === "GREEN_SPACES"
              ? ["URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION"]
              : [];

      const shouldInvalidateBuildings =
        answers.spacesCategories[0] === "LIVING_AND_ACTIVITY_SPACES" &&
        ReadStateHelper.hasBuildings(context.stepsState);

      if (shouldInvalidateBuildings) {
        invalidSteps.push(...BUILDINGS_STEPS);
      }

      return {
        complete: [
          {
            stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
            payload: {
              spacesCategoriesDistribution: {
                [answers.spacesCategories[0]]: context.siteData?.surfaceArea,
              },
            },
            invalidSteps: hasChanged ? invalidSteps : [],
          },
        ],
        next: "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION",
      };
    }

    return undefined;
  },
} as const;

import deepEqual from "@/shared/core/deep-equal/deepEqual";

import { ReadStateHelper } from "../../helpers/readState";
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

  getStepsToInvalidate(context, newAnswers) {
    const stepsToDelete: AnswerStepId[] = [];
    const stepsToInvalidate: AnswerStepId[] = [];
    const stepsToRecompute: AnswerStepId[] = [];

    const newCategories = newAnswers.spacesCategories;

    if (
      deepEqual(
        context.stepsState.URBAN_PROJECT_SPACES_CATEGORIES_SELECTION?.payload?.spacesCategories,
        newAnswers.spacesCategories,
      )
    ) {
      return undefined;
    }

    if (context.stepsState.URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA) {
      stepsToDelete.push("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA");
    }

    if (context.stepsState.URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION) {
      if (!newCategories?.includes("GREEN_SPACES")) {
        stepsToDelete.push("URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION");
      }
    }

    if (context.stepsState.URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION) {
      if (!newCategories?.includes("PUBLIC_SPACES")) {
        stepsToDelete.push("URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION");
      }
    }

    if (context.stepsState.URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION) {
      if (!newCategories?.includes("LIVING_AND_ACTIVITY_SPACES")) {
        stepsToDelete.push("URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION");
        BUILDINGS_STEPS.forEach((stepId) => {
          if (context.stepsState[stepId]) {
            stepsToDelete.push(stepId);
          }
        });
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

  getShortcut(context, answers) {
    if (answers.spacesCategories?.length === 1 && answers.spacesCategories[0]) {
      return {
        complete: [
          {
            stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
            answers: {
              spacesCategoriesDistribution: {
                [answers.spacesCategories[0]]: context.siteData?.surfaceArea,
              },
            },
          },
        ],
        next: "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION",
      };
    }

    return undefined;
  },
} as const;

import { AnswerStepHandler } from "../stepHandler.type";
import { getDeleteBuildingsRules, getReinstatementCostsRecomputationRules } from "./getCommonRules";

const STEP_ID = "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION" as const;

export const UrbanProjectSpacesCategoriesSelectionHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,

  getPreviousStepId() {
    return "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA";
  },

  getDependencyRules(context, newAnswers) {
    const previousCategories =
      context.stepsState.URBAN_PROJECT_SPACES_CATEGORIES_SELECTION?.payload?.spacesCategories;
    const newCategories = newAnswers.spacesCategories;

    const noChanges =
      previousCategories?.length === newCategories?.length &&
      newCategories?.every((cat) => previousCategories?.includes(cat)) &&
      previousCategories?.every((cat) => newCategories.includes(cat));

    if (noChanges) {
      return [];
    }

    const rules = getReinstatementCostsRecomputationRules(context);

    if (context.stepsState.URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA) {
      rules.push({ stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA", action: "delete" });
    }

    if (context.stepsState.URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION) {
      if (!newCategories?.includes("GREEN_SPACES")) {
        rules.push({
          stepId: "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
          action: "delete",
        });
      }
    }

    if (context.stepsState.URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION) {
      if (!newCategories?.includes("PUBLIC_SPACES")) {
        rules.push({ stepId: "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION", action: "delete" });
      }
    }

    if (context.stepsState.URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION) {
      if (!newCategories?.includes("LIVING_AND_ACTIVITY_SPACES")) {
        rules.push({
          stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
          action: "delete",
        });
        rules.push(...getDeleteBuildingsRules(context));
      }
    }
    return rules;
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

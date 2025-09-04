import { ReadStateHelper } from "../../urbanProject.helpers";
import { InfoStepHandler } from "../stepHandler.type";

export const SpaceDevelopmentPlanIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION",

  getPreviousStepId(context) {
    const spaceCategories = ReadStateHelper.getStepAnswers(
      context.stepsState,
      "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION",
    )?.spacesCategories;
    return spaceCategories && spaceCategories.length === 1
      ? "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION"
      : "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA";
  },

  getNextStepId(context) {
    const spacesCategoriesDistribution = ReadStateHelper.getStepAnswers(
      context.stepsState,
      "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
    )?.spacesCategoriesDistribution;

    if (spacesCategoriesDistribution?.LIVING_AND_ACTIVITY_SPACES) {
      return "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_INTRODUCTION";
    }

    if (spacesCategoriesDistribution?.PUBLIC_SPACES) {
      return "URBAN_PROJECT_PUBLIC_SPACES_INTRODUCTION";
    }

    if (spacesCategoriesDistribution?.GREEN_SPACES) {
      return "URBAN_PROJECT_GREEN_SPACES_INTRODUCTION";
    }

    return "URBAN_PROJECT_SPACES_SOILS_SUMMARY";
  },
};

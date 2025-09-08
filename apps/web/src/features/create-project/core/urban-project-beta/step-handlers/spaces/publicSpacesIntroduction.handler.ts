import { ReadStateHelper } from "../../helpers/readState";
import { InfoStepHandler } from "../stepHandler.type";

export const PublicSpacesIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_PUBLIC_SPACES_INTRODUCTION",

  getPreviousStepId(context) {
    const spacesCategoriesDistribution = ReadStateHelper.getStepAnswers(
      context.stepsState,
      "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
    )?.spacesCategoriesDistribution;

    if (spacesCategoriesDistribution?.LIVING_AND_ACTIVITY_SPACES) {
      return "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION";
    }

    return "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION";
  },
};

import { FormState } from "../../form-state/formState";
import { InfoStepHandler } from "../stepHandler.type";

export const GreenSpacesIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_GREEN_SPACES_INTRODUCTION",

  getPreviousStepId(context) {
    const spacesCategoriesDistribution = FormState.getStepAnswers(
      context.urbanProjectEventSourcing.events,
      "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
    )?.spacesCategoriesDistribution;

    if (spacesCategoriesDistribution?.PUBLIC_SPACES) {
      return "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION";
    }

    if (spacesCategoriesDistribution?.LIVING_AND_ACTIVITY_SPACES) {
      return "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION";
    }

    return "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION";
  },
};

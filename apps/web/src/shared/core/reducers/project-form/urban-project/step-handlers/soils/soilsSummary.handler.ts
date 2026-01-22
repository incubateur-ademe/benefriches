import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import type { InfoStepHandler } from "../stepHandler.type";

export const SoilsSummaryHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_SPACES_SOILS_SUMMARY",

  getPreviousStepId(context) {
    // Check if we came from the new spaces flow (uses flow)
    if (ReadStateHelper.getStep(context.stepsState, "URBAN_PROJECT_SPACES_SURFACE_AREA")) {
      return "URBAN_PROJECT_SPACES_SURFACE_AREA";
    }

    // Legacy spaces flow
    const spacesCategoriesDistribution = ReadStateHelper.getStepAnswers(
      context.stepsState,
      "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
    )?.spacesCategoriesDistribution;

    if (spacesCategoriesDistribution?.GREEN_SPACES) {
      return "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION";
    }

    if (spacesCategoriesDistribution?.PUBLIC_SPACES) {
      return "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION";
    }

    if (spacesCategoriesDistribution?.LIVING_AND_ACTIVITY_SPACES) {
      return "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION";
    }

    return "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SOILS_CARBON_SUMMARY";
  },
};

import { isObjectsEqual } from "@/shared/core/isObjectsEqual/isObjectsEqual";
import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import { AnswerStepHandler } from "../stepHandler.type";
import { getDeleteBuildingsRules, getReinstatementCostsRecomputationRules } from "./getCommonRules";

const STEP_ID = "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION";

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

  getDependencyRules(context, newAnswers) {
    const previousDistribution =
      ReadStateHelper.getStepAnswers(
        context.stepsState,
        "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
      )?.livingAndActivitySpacesDistribution ?? {};

    const newDistribution = newAnswers.livingAndActivitySpacesDistribution ?? {};

    if (isObjectsEqual(previousDistribution, newDistribution)) {
      return [];
    }

    const rules = getReinstatementCostsRecomputationRules(context);

    const previousBuildingsSurface = previousDistribution.BUILDINGS;
    const newBuildingsSurface = newDistribution.BUILDINGS;

    if (previousBuildingsSurface === newBuildingsSurface) {
      return rules;
    }

    if (previousBuildingsSurface) {
      if (!newBuildingsSurface) {
        rules.push(...getDeleteBuildingsRules(context));
        return rules;
      }

      if (
        ReadStateHelper.getStep(context.stepsState, "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA")
      ) {
        rules.push({ stepId: "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA", action: "invalidate" });
      }
    }

    return rules;
  },
} as const;

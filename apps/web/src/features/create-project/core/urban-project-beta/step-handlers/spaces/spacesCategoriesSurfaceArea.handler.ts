import { isObjectsEqual } from "@/shared/core/isObjectsEqual/isObjectsEqual";

import { ReadStateHelper } from "../../helpers/readState";
import { AnswerStepHandler } from "../stepHandler.type";
import { getDeleteBuildingsRules, getReinstatementCostsRecomputationRules } from "./getCommonRules";

const STEP_ID = "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA" as const;

export const UrbanProjectSpacesCategoriesSurfaceAreaHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,
  getDependencyRules(context, newAnswers) {
    const previousDistribution =
      ReadStateHelper.getStepAnswers(context.stepsState, STEP_ID)?.spacesCategoriesDistribution ??
      {};
    const newDistribution = newAnswers.spacesCategoriesDistribution ?? {};

    if (isObjectsEqual(previousDistribution, newDistribution)) {
      return [];
    }

    const rules = getReinstatementCostsRecomputationRules(context);

    if (
      ReadStateHelper.getStep(
        context.stepsState,
        "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
      )
    ) {
      const shouldDelete = !newDistribution.GREEN_SPACES;
      const shouldInvalidate = previousDistribution.GREEN_SPACES !== newDistribution.GREEN_SPACES;
      if (shouldDelete || shouldInvalidate) {
        rules.push({
          stepId: "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
          action: shouldDelete ? "delete" : "invalidate",
        });
      }
    }

    if (ReadStateHelper.getStep(context.stepsState, "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION")) {
      const shouldDelete = !newDistribution.PUBLIC_SPACES;
      const shouldInvalidate = previousDistribution.PUBLIC_SPACES !== newDistribution.PUBLIC_SPACES;
      if (shouldDelete || shouldInvalidate) {
        rules.push({
          stepId: "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",
          action: shouldDelete ? "delete" : "invalidate",
        });
      }
    }

    if (
      ReadStateHelper.getStep(
        context.stepsState,
        "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
      )
    ) {
      const shouldDelete = !newDistribution.LIVING_AND_ACTIVITY_SPACES;
      const shouldInvalidate =
        previousDistribution.LIVING_AND_ACTIVITY_SPACES !==
        newDistribution.LIVING_AND_ACTIVITY_SPACES;

      if (shouldDelete || shouldInvalidate) {
        rules.push({
          stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
          action: shouldDelete ? "delete" : "invalidate",
        });
      }

      if (shouldDelete) {
        rules.push(...getDeleteBuildingsRules(context));
      }
    }
    return rules;
  },

  getPreviousStepId() {
    return "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION";
  },
};

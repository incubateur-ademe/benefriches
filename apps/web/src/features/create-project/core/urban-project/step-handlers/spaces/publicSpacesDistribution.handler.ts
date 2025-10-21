import { isObjectsEqual } from "@/shared/core/isObjectsEqual/isObjectsEqual";
import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import { AnswerStepHandler } from "../stepHandler.type";
import { getReinstatementCostsRecomputationRules } from "./getCommonRules";

export const PublicSpacesDistributionHandler: AnswerStepHandler<"URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION"> =
  {
    stepId: "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",

    getDependencyRules(context, newAnswers) {
      const previousDistribution =
        ReadStateHelper.getStepAnswers(
          context.stepsState,
          "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",
        )?.publicSpacesDistribution ?? {};
      const newDistribution = newAnswers.publicSpacesDistribution ?? {};

      if (isObjectsEqual(previousDistribution, newDistribution)) {
        return [];
      }

      return getReinstatementCostsRecomputationRules(context);
    },

    getPreviousStepId() {
      return "URBAN_PROJECT_PUBLIC_SPACES_INTRODUCTION";
    },

    getNextStepId(context) {
      const spacesCategoriesDistribution = ReadStateHelper.getStepAnswers(
        context.stepsState,
        "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
      )?.spacesCategoriesDistribution;

      if (spacesCategoriesDistribution?.GREEN_SPACES) {
        return "URBAN_PROJECT_GREEN_SPACES_INTRODUCTION";
      }

      return "URBAN_PROJECT_SPACES_SOILS_SUMMARY";
    },
  };

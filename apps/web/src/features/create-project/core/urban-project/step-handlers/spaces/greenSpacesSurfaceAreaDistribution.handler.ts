import { isObjectsEqual } from "@/shared/core/isObjectsEqual/isObjectsEqual";

import { ReadStateHelper } from "../../helpers/readState";
import { AnswerStepHandler } from "../stepHandler.type";
import { getReinstatementCostsRecomputationRules } from "./getCommonRules";

export const GreenSpacesSurfaceAreaDistributionHandler: AnswerStepHandler<"URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION"> =
  {
    stepId: "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",

    getDependencyRules(context, newAnswers) {
      const previousDistribution =
        ReadStateHelper.getStepAnswers(
          context.stepsState,
          "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
        )?.greenSpacesDistribution ?? {};
      const newDistribution = newAnswers.greenSpacesDistribution ?? {};

      if (isObjectsEqual(previousDistribution, newDistribution)) {
        return [];
      }

      return getReinstatementCostsRecomputationRules(context);
    },

    getPreviousStepId() {
      return "URBAN_PROJECT_GREEN_SPACES_INTRODUCTION";
    },

    getNextStepId() {
      return "URBAN_PROJECT_SPACES_SOILS_SUMMARY";
    },
  };

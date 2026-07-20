import { transformNonSuitableSoils } from "shared";

import type { AnswerStepHandler } from "../../stepHandler.type";

export const NonSuitableSoilsSurfaceHandler: AnswerStepHandler<"RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE"> =
  {
    stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE",

    getNextStepId() {
      return "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION";
    },

    updateAnswersMiddleware(params, answers) {
      const baseSoilsDistributionForTransformation = transformNonSuitableSoils(
        params.context.siteData?.soilsDistribution ?? {},
        answers.nonSuitableSoilsSurfaceAreaToTransform ?? {},
      );
      return { ...answers, baseSoilsDistributionForTransformation };
    },
  };

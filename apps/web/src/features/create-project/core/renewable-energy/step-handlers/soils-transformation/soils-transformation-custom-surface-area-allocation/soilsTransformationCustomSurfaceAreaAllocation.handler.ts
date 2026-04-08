import { hasSiteSignificantBiodiversityAndClimateSensibleSoils, stripEmptySurfaces } from "shared";

import type { AnswerStepHandler } from "../../stepHandler.type";

export const CustomSurfaceAreaAllocationHandler: AnswerStepHandler<"RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION"> =
  {
    stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",

    getPreviousStepId() {
      return "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION";
    },

    getNextStepId(context) {
      return hasSiteSignificantBiodiversityAndClimateSensibleSoils(
        context.siteData?.soilsDistribution ?? {},
      )
        ? "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE"
        : "RENEWABLE_ENERGY_SOILS_SUMMARY";
    },

    updateAnswersMiddleware(_context, answers) {
      return {
        soilsDistribution: answers.soilsDistribution
          ? stripEmptySurfaces(answers.soilsDistribution)
          : {},
      };
    },
  };

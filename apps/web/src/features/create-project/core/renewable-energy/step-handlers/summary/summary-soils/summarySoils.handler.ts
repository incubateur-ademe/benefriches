import { hasSiteSignificantBiodiversityAndClimateSensibleSoils } from "shared";

import { ReadStateHelper } from "../../../helpers/readState";
import type { InfoStepHandler } from "../../stepHandler.type";

export const SoilsSummaryHandler: InfoStepHandler = {
  stepId: "RENEWABLE_ENERGY_SOILS_SUMMARY",

  getPreviousStepId(context) {
    if (
      ReadStateHelper.getStepAnswers(
        context.stepsState,
        "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
      )?.soilsTransformationProject === "custom"
    ) {
      return "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION";
    }

    return hasSiteSignificantBiodiversityAndClimateSensibleSoils(
      context.siteData?.soilsDistribution ?? {},
    )
      ? "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE"
      : "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION";
  },

  getNextStepId() {
    return "RENEWABLE_ENERGY_SOILS_CARBON_STORAGE";
  },
};

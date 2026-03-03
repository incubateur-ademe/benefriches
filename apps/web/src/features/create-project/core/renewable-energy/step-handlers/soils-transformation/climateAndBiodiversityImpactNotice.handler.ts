import type { InfoStepHandler } from "../stepHandler.type";

export const ClimateAndBiodiversityImpactNoticeHandler: InfoStepHandler = {
  stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE",

  getNextStepId() {
    return "RENEWABLE_ENERGY_SOILS_SUMMARY";
  },
};

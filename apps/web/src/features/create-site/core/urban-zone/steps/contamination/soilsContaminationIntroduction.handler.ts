import type { InfoStepHandler } from "../../step-handlers/stepHandler.type";

export const UrbanZoneSoilsContaminationIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_ZONE_SOILS_CONTAMINATION_INTRODUCTION",

  getNextStepId() {
    return "URBAN_ZONE_SOILS_CONTAMINATION";
  },

  getPreviousStepId() {
    return "URBAN_ZONE_SOILS_CARBON_STORAGE";
  },
};

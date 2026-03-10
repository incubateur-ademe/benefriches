import type { InfoStepHandler } from "../../../step-handlers/stepHandler.type";

export const UrbanZoneSoilsCarbonStorageHandler: InfoStepHandler = {
  stepId: "URBAN_ZONE_SOILS_CARBON_STORAGE",

  getNextStepId() {
    return "URBAN_ZONE_SOILS_CONTAMINATION_INTRODUCTION";
  },

  getPreviousStepId() {
    return "URBAN_ZONE_SOILS_SUMMARY";
  },
};

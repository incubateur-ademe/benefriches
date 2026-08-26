import type { InfoStepHandler } from "../../../stepHandlerRegistry";

export const UrbanZoneSoilsCarbonStorageHandler = {
  stepId: "URBAN_ZONE_SOILS_CARBON_STORAGE",

  getNextStepId() {
    return "URBAN_ZONE_SOILS_CONTAMINATION_INTRODUCTION";
  },

  getPreviousStepId() {
    return "URBAN_ZONE_SOILS_SUMMARY";
  },
} satisfies InfoStepHandler;

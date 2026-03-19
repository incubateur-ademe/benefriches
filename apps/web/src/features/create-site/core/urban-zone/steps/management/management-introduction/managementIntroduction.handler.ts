import type { InfoStepHandler } from "../../../stepHandler.type";

export const UrbanZoneManagementIntroductionHandler = {
  stepId: "URBAN_ZONE_MANAGEMENT_INTRODUCTION",

  getNextStepId() {
    return "URBAN_ZONE_MANAGER";
  },

  getPreviousStepId() {
    return "URBAN_ZONE_SOILS_CONTAMINATION";
  },
} satisfies InfoStepHandler;

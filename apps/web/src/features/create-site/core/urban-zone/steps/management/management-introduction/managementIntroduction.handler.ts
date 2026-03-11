import type { InfoStepHandler } from "../../../step-handlers/stepHandler.type";

export const UrbanZoneManagementIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_ZONE_MANAGEMENT_INTRODUCTION",

  getNextStepId() {
    return "URBAN_ZONE_MANAGER";
  },

  getPreviousStepId() {
    return "URBAN_ZONE_SOILS_CONTAMINATION";
  },
};

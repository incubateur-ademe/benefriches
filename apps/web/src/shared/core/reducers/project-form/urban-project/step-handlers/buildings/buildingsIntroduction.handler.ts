import { InfoStepHandler } from "../stepHandler.type";

export const BuildingsIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_BUILDINGS_INTRODUCTION",

  getPreviousStepId() {
    return "URBAN_PROJECT_SOILS_CARBON_SUMMARY";
  },

  getNextStepId() {
    return "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA";
  },
};

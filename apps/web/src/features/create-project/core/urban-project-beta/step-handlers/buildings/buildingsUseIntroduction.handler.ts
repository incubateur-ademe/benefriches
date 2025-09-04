import { InfoStepHandler } from "../stepHandler.type";

export const BuildingsUseIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION",

  getPreviousStepId() {
    return "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA";
  },
  getNextStepId() {
    return "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION";
  },
};

import type { InfoStepHandler } from "../../stepHandler.type";

export const BuildingsReuseIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION",
  getPreviousStepId() {
    return "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA";
  },
  getNextStepId() {
    return "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE";
  },
};

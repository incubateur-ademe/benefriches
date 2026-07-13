import type { InfoStepHandler } from "../../stepHandler.type";
import { getNextStepAfterBuildings } from "../buildingsReaders";

export const BuildingsNewConstructionIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION",
  getPreviousStepId() {
    return "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA";
  },
  getNextStepId(context) {
    return getNextStepAfterBuildings(context);
  },
};

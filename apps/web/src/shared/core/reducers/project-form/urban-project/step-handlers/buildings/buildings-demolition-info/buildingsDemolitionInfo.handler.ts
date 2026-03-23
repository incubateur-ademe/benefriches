import type { InfoStepHandler } from "../../stepHandler.type";
import {
  getNextStepAfterBuildings,
  hasBothReuseAndNewConstruction,
  willConstructNewBuildings,
} from "../buildingsReaders";

export const BuildingsDemolitionInfoHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO",
  getPreviousStepId() {
    return "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE";
  },
  getNextStepId(context) {
    if (hasBothReuseAndNewConstruction(context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA";
    }
    if (willConstructNewBuildings(context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO";
    }
    return getNextStepAfterBuildings(context);
  },
};

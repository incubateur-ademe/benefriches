import type { InfoStepHandler } from "../../stepHandler.type";
import {
  getNextStepAfterBuildings,
  hasBothReuseAndNewConstruction,
  willDemolishBuildings,
} from "../buildingsReaders";

export const BuildingsNewConstructionInfoHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO",
  getPreviousStepId(context) {
    if (hasBothReuseAndNewConstruction(context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA";
    }
    if (context.siteData && willDemolishBuildings(context.siteData, context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO";
    }
    return "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE";
  },
  getNextStepId(context) {
    if (hasBothReuseAndNewConstruction(context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA";
    }
    return getNextStepAfterBuildings(context);
  },
};

import type { InfoStepHandler } from "../../stepHandler.type";
import {
  getNextStepAfterBuildings,
  hasBothReuseAndNewConstruction,
  shouldRouteToNewBuildingsUsesFloorSurfaceArea,
  willDemolishBuildings,
} from "../buildingsReaders";

export const BuildingsNewConstructionInfoHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO",
  getPreviousStepId({ answers, context }) {
    if (hasBothReuseAndNewConstruction(answers)) {
      return "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA";
    }
    if (context.siteData && willDemolishBuildings(context.siteData, answers)) {
      return "URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO";
    }
    return "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE";
  },
  getNextStepId(params) {
    if (shouldRouteToNewBuildingsUsesFloorSurfaceArea(params.answers)) {
      return "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA";
    }
    return getNextStepAfterBuildings(params);
  },
};

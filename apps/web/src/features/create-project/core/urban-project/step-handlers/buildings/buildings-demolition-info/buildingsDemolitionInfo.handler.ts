import { willHaveBuildings } from "@/features/create-project/core/urban-project/helpers/readers/buildingsReaders";

import type { InfoStepHandler } from "../../stepHandler.type";
import {
  getNextStepAfterBuildings,
  hasBothReuseAndNewConstruction,
  willConstructNewBuildings,
} from "../buildingsReaders";

export const BuildingsDemolitionInfoHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO",
  getPreviousStepId(params) {
    if (!willHaveBuildings(params.answers)) {
      return "URBAN_PROJECT_SOILS_CARBON_SUMMARY";
    }
    return "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE";
  },
  getNextStepId(params) {
    if (hasBothReuseAndNewConstruction(params.answers)) {
      return "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA";
    }
    if (willConstructNewBuildings(params.answers)) {
      return "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO";
    }
    return getNextStepAfterBuildings(params);
  },
};

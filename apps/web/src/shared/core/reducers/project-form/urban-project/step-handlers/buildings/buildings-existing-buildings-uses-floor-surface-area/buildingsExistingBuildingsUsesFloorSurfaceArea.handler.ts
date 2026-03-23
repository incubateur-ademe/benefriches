import type { AnswerStepHandler } from "../../stepHandler.type";
import { willDemolishBuildings } from "../buildingsReaders";

const STEP_ID = "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA";

export const BuildingsExistingBuildingsUsesFloorSurfaceAreaHandler: AnswerStepHandler<
  typeof STEP_ID
> = {
  stepId: STEP_ID,
  getPreviousStepId(context) {
    if (context.siteData && willDemolishBuildings(context.siteData, context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO";
    }
    return "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE";
  },
  getNextStepId() {
    return "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO";
  },
};

import type { AnswerStepHandler } from "../../stepHandler.type";
import { getNextStepAfterBuildings } from "../buildingsReaders";

const STEP_ID = "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA";

export const NewBuildingsUsesFloorSurfaceAreaHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,
  getPreviousStepId() {
    return "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO";
  },
  getNextStepId(context) {
    return getNextStepAfterBuildings(context);
  },
};

import { AnswerStepHandler } from "../stepHandler.type";

export const BuildingsFloorSurfaceAreaHandler: AnswerStepHandler<"URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA"> =
  {
    stepId: "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA",

    getPreviousStepId() {
      return "URBAN_PROJECT_BUILDINGS_INTRODUCTION";
    },

    getNextStepId() {
      return "URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION";
    },
  };

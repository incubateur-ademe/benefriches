import { AnswerStepHandler } from "../stepHandler.type";

export const BuildingsFloorSurfaceAreaHandler: AnswerStepHandler<"URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA"> =
  {
    stepId: "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA",

    getStepsToInvalidate(state, newAnswers) {
      if (state.stepsState.URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION) {
        if (
          newAnswers.buildingsFloorSurfaceArea !==
          state.stepsState.URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA?.payload
            ?.buildingsFloorSurfaceArea
        ) {
          return {
            invalid: ["URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION"],
          };
        }
      }
    },

    getPreviousStepId() {
      return "URBAN_PROJECT_BUILDINGS_INTRODUCTION";
    },

    getNextStepId() {
      return "URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION";
    },
  };

import { ReadStateHelper } from "../../helpers/readState";
import { AnswerStepHandler } from "../stepHandler.type";

export const BuildingsFloorSurfaceAreaHandler: AnswerStepHandler<"URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA"> =
  {
    stepId: "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA",

    getDependencyRules(context, newAnswers) {
      if (
        ReadStateHelper.getStep(
          context.stepsState,
          "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
        )
      ) {
        const newBuildingsFloorSurface = newAnswers.buildingsFloorSurfaceArea;
        const oldBuildingsFloorSurface = ReadStateHelper.getStepAnswers(
          context.stepsState,
          "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA",
        )?.buildingsFloorSurfaceArea;

        if (newBuildingsFloorSurface !== oldBuildingsFloorSurface) {
          return [
            {
              stepId: "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
              action: "invalidate",
            },
          ];
        }
      }
      return [];
    },

    getPreviousStepId() {
      return "URBAN_PROJECT_BUILDINGS_INTRODUCTION";
    },

    getNextStepId() {
      return "URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION";
    },
  };

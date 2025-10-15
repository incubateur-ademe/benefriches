import { AnswerStepHandler } from "../stepHandler.type";

export const BuildingsUseSurfaceAreaDistributionHandler: AnswerStepHandler<"URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION"> =
  {
    stepId: "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",

    getPreviousStepId() {
      return "URBAN_PROJECT_BUILDINGS_USE_SELECTION";
    },

    getNextStepId() {
      return "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION";
    },
  };

import type { AnswerStepHandler } from "../../stepHandler.type";

export const CustomSoilsSelectionHandler: AnswerStepHandler<"RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION"> =
  {
    stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",

    getPreviousStepId() {
      return "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION";
    },

    getNextStepId() {
      return "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION";
    },
  };

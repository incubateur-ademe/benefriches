import type { AnswerStepHandler } from "../stepHandler.type";

export const NonSuitableSoilsSelectionHandler: AnswerStepHandler<"RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION"> =
  {
    stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION",

    getNextStepId() {
      return "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE";
    },
  };

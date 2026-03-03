import type { InfoStepHandler } from "../../stepHandler.type";

export const NonSuitableSoilsNoticeHandler: InfoStepHandler = {
  stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_NOTICE",

  getNextStepId() {
    return "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION";
  },
};

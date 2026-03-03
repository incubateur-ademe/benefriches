import type { InfoStepHandler } from "../stepHandler.type";

export const SoilsDecontaminationIntroductionHandler: InfoStepHandler = {
  stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION",

  getNextStepId() {
    return "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION";
  },
};

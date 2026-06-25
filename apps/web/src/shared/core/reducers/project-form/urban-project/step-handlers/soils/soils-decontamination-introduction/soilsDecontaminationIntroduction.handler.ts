import type { InfoStepHandler } from "../../stepHandler.type";

export const SoilsDecontaminationIntroductionHandler = {
  stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION",

  getPreviousStepId() {
    return "URBAN_PROJECT_INVOLVES_REINSTATEMENT";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION";
  },
} satisfies InfoStepHandler;

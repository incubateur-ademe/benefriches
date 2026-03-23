import type { InfoStepHandler } from "../../stepHandler.type";

export const UsesIntroductionHandler = {
  stepId: "URBAN_PROJECT_USES_INTRODUCTION",

  getPreviousStepId() {
    return "URBAN_PROJECT_CREATE_MODE_SELECTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_USES_SELECTION";
  },
} satisfies InfoStepHandler;

import type { InfoStepHandler } from "../../stepHandler.type";

export const UsesIntroductionHandler = {
  stepId: "URBAN_PROJECT_USES_INTRODUCTION",

  getNextStepId() {
    return "URBAN_PROJECT_USES_SELECTION";
  },
} satisfies InfoStepHandler;

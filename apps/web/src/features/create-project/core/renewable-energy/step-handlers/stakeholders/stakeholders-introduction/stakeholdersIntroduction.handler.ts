import type { InfoStepHandler } from "../../stepHandler.type";

export const StakeholdersIntroductionHandler: InfoStepHandler = {
  stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_INTRODUCTION",

  getNextStepId() {
    return "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER";
  },
};

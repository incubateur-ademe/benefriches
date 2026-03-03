import type { InfoStepHandler } from "../../stepHandler.type";

export const RevenueIntroductionHandler: InfoStepHandler = {
  stepId: "RENEWABLE_ENERGY_REVENUE_INTRODUCTION",

  getNextStepId() {
    return "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE";
  },
};

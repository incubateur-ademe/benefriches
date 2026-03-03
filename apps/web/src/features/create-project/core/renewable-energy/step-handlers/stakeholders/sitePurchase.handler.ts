import type { AnswerStepHandler } from "../stepHandler.type";

export const SitePurchaseHandler: AnswerStepHandler<"RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE"> =
  {
    stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",

    getNextStepId(_context, answers) {
      return answers?.willSiteBePurchased
        ? "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER"
        : "RENEWABLE_ENERGY_EXPENSES_INTRODUCTION";
    },
  };

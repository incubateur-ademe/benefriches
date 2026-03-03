import type { AnswerStepHandler } from "../stepHandler.type";

export const FutureSiteOwnerHandler: AnswerStepHandler<"RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER"> =
  {
    stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER",

    getNextStepId() {
      return "RENEWABLE_ENERGY_EXPENSES_INTRODUCTION";
    },
  };

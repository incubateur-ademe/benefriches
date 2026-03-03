import type { AnswerStepHandler } from "../stepHandler.type";

export const FinancialAssistanceHandler: AnswerStepHandler<"RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE"> =
  {
    stepId: "RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE",

    getNextStepId() {
      return "RENEWABLE_ENERGY_SCHEDULE_PROJECTION";
    },
  };

import type { AnswerStepHandler } from "../../stepHandler.type";

export const YearlyProjectedRevenueHandler: AnswerStepHandler<"RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE"> =
  {
    stepId: "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE",

    getNextStepId() {
      return "RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE";
    },
  };

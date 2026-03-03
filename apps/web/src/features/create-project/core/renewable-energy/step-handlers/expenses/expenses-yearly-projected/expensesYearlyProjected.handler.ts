import type { AnswerStepHandler } from "../../stepHandler.type";

export const YearlyProjectedExpensesHandler: AnswerStepHandler<"RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES"> =
  {
    stepId: "RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES",

    getNextStepId() {
      return "RENEWABLE_ENERGY_REVENUE_INTRODUCTION";
    },
  };

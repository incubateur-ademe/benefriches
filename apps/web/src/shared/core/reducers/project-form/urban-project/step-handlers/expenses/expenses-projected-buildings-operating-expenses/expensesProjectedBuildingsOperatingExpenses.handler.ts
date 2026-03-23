import type { AnswerStepHandler } from "../../stepHandler.type";

export const ExpensesProjectedBuildingsOperatingExpensesHandler = {
  stepId: "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES",

  getPreviousStepId() {
    return "URBAN_PROJECT_EXPENSES_INSTALLATION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_REVENUE_INTRODUCTION";
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES">;

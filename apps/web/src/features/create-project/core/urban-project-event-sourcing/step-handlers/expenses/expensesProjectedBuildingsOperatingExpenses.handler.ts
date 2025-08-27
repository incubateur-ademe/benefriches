import { AnswerStepHandler } from "../stepHandler.type";

export const ExpensesProjectedBuildingsOperatingExpensesHandler: AnswerStepHandler<"URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES"> =
  {
    stepId: "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES",

    getPreviousStepId() {
      return "URBAN_PROJECT_EXPENSES_INSTALLATION";
    },

    getNextStepId() {
      return "URBAN_PROJECT_REVENUE_INTRODUCTION";
    },
  };

import type { AnswerStepHandler } from "../../../step-handlers/stepHandler.type";

export const LocalAuthorityExpensesHandler = {
  stepId: "URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES",

  getNextStepId() {
    return "URBAN_ZONE_NAMING_INTRODUCTION";
  },

  getPreviousStepId() {
    return "URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION";
  },
} satisfies AnswerStepHandler<"URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES">;

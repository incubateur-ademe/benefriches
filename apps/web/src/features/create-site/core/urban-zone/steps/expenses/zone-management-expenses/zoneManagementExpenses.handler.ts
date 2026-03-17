import type { AnswerStepHandler } from "../../../step-handlers/stepHandler.type";
import { hasVacantPremises } from "../expensesConditions";

export const ZoneManagementExpensesHandler = {
  stepId: "URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES",

  getNextStepId() {
    return "URBAN_ZONE_ZONE_MANAGEMENT_INCOME";
  },

  getPreviousStepId(context) {
    if (hasVacantPremises(context)) {
      return "URBAN_ZONE_VACANT_PREMISES_EXPENSES";
    }
    return "URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION";
  },
} satisfies AnswerStepHandler<"URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES">;

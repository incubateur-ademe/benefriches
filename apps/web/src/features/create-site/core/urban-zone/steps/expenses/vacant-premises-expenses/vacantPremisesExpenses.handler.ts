import type { AnswerStepHandler } from "../../../step-handlers/stepHandler.type";
import { hasActivity } from "../activityReaders";

export const VacantPremisesExpensesHandler = {
  stepId: "URBAN_ZONE_VACANT_PREMISES_EXPENSES",

  getNextStepId(context) {
    if (hasActivity(context)) {
      return "URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES";
    }
    return "URBAN_ZONE_EXPENSES_AND_INCOME_SUMMARY";
  },

  getPreviousStepId() {
    return "URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION";
  },
} satisfies AnswerStepHandler<"URBAN_ZONE_VACANT_PREMISES_EXPENSES">;

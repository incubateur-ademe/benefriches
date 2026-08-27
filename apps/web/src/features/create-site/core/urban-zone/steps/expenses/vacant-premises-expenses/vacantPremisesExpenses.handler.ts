import type { UrbanZoneAnswerStepHandler } from "../../../stepHandlerRegistry";
import { hasActivity } from "../activityReaders";

export const VacantPremisesExpensesHandler = {
  stepId: "URBAN_ZONE_VACANT_PREMISES_EXPENSES",

  getNextStepId(params) {
    if (hasActivity(params)) {
      return "URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES";
    }
    return "URBAN_ZONE_EXPENSES_AND_INCOME_SUMMARY";
  },

  getPreviousStepId() {
    return "URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION";
  },
} satisfies UrbanZoneAnswerStepHandler<"URBAN_ZONE_VACANT_PREMISES_EXPENSES">;

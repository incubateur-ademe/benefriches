import type {
  InfoStepHandler,
  UrbanZoneStepContext,
} from "../../../step-handlers/stepHandler.type";
import { hasActivity, hasVacantPremises } from "../expensesConditions";

export const ExpensesAndIncomeSummaryHandler = {
  stepId: "URBAN_ZONE_EXPENSES_AND_INCOME_SUMMARY",

  getNextStepId() {
    return "URBAN_ZONE_NAMING_INTRODUCTION";
  },

  getPreviousStepId(context: UrbanZoneStepContext) {
    if (hasActivity(context)) {
      return "URBAN_ZONE_ZONE_MANAGEMENT_INCOME";
    }
    if (hasVacantPremises(context)) {
      return "URBAN_ZONE_VACANT_PREMISES_EXPENSES";
    }
    // Fallback: should not occur in practice — activity park managers always reach this summary
    // through at least one of the two branches above. Defensive fallback to introduction.
    return "URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION";
  },
} satisfies InfoStepHandler;

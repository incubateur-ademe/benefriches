import type { UrbanZoneAnswerStepHandler } from "../../../stepHandlerRegistry";
import { hasVacantPremises } from "../../management/managementReaders";

export const ZoneManagementExpensesHandler = {
  stepId: "URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES",

  getNextStepId() {
    return "URBAN_ZONE_ZONE_MANAGEMENT_INCOME";
  },

  getPreviousStepId(params) {
    if (hasVacantPremises(params)) {
      return "URBAN_ZONE_VACANT_PREMISES_EXPENSES";
    }
    return "URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION";
  },
} satisfies UrbanZoneAnswerStepHandler<"URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES">;

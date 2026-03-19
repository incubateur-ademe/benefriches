import type {
  InfoStepHandler,
  UrbanZoneStepContext,
} from "../../../step-handlers/stepHandler.type";
import {
  hasVacantPremises,
  isActivityParkManager,
  isLocalAuthority,
} from "../../management/managementReaders";
import { hasActivity } from "../activityReaders";

export const ExpensesAndIncomeIntroductionHandler = {
  stepId: "URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION",

  getNextStepId(context: UrbanZoneStepContext) {
    if (isActivityParkManager(context)) {
      if (hasVacantPremises(context)) {
        return "URBAN_ZONE_VACANT_PREMISES_EXPENSES";
      }
      if (hasActivity(context)) {
        return "URBAN_ZONE_ZONE_MANAGEMENT_EXPENSES";
      }
      return "URBAN_ZONE_EXPENSES_AND_INCOME_SUMMARY";
    }
    if (isLocalAuthority(context)) {
      return "URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES";
    }
    // Fallback: should not occur in practice — the MANAGER step only offers the two types above
    return "URBAN_ZONE_NAMING_INTRODUCTION";
  },

  getPreviousStepId(context: UrbanZoneStepContext) {
    if (hasVacantPremises(context) && !hasActivity(context)) {
      return "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA";
    }
    return "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT";
  },
} satisfies InfoStepHandler;

import type { InfoStepHandler, UrbanZoneStepContext } from "../../step-handlers/stepHandler.type";
import { isActivityParkManager, isLocalAuthority } from "../expenses/expensesConditions";

export const UrbanZoneNamingIntroductionHandler = {
  stepId: "URBAN_ZONE_NAMING_INTRODUCTION",

  getNextStepId() {
    return "URBAN_ZONE_NAMING";
  },

  getPreviousStepId(context: UrbanZoneStepContext) {
    if (isActivityParkManager(context)) {
      return "URBAN_ZONE_EXPENSES_AND_INCOME_SUMMARY";
    }
    if (isLocalAuthority(context)) {
      return "URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES";
    }
    return "URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION";
  },
} satisfies InfoStepHandler;

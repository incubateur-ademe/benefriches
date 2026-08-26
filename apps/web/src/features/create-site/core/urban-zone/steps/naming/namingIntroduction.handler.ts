import type { InfoStepHandler, UrbanZoneStepParams } from "../../stepHandlerRegistry";
import { isActivityParkManager, isLocalAuthority } from "../management/managementReaders";

export const UrbanZoneNamingIntroductionHandler = {
  stepId: "URBAN_ZONE_NAMING_INTRODUCTION",

  getNextStepId() {
    return "URBAN_ZONE_NAMING";
  },

  getPreviousStepId(params: UrbanZoneStepParams) {
    if (isActivityParkManager(params)) {
      return "URBAN_ZONE_EXPENSES_AND_INCOME_SUMMARY";
    }
    if (isLocalAuthority(params)) {
      return "URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES";
    }
    return "URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION";
  },
} satisfies InfoStepHandler;

import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import { InfoStepHandler } from "../stepHandler.type";

export const RevenueIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_REVENUE_INTRODUCTION",

  getPreviousStepId(context) {
    if (ReadStateHelper.hasBuildings(context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION";
    }
    return "URBAN_PROJECT_SITE_RESALE_SELECTION";
  },

  getNextStepId(context) {
    if (ReadStateHelper.isSiteResalePlannedAfterDevelopment(context.stepsState)) {
      return "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE";
    }

    if (ReadStateHelper.hasBuildings(context.stepsState)) {
      if (ReadStateHelper.hasBuildingsResalePlannedAfterDevelopment(context.stepsState)) {
        return "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE";
      }
      return "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES";
    }

    return "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE";
  },
};

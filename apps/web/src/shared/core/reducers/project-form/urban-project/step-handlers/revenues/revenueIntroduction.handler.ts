import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import { InfoStepHandler } from "../stepHandler.type";

export const RevenueIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_REVENUE_INTRODUCTION",

  getPreviousStepId(context) {
    if (
      ReadStateHelper.hasBuildings(context.stepsState) &&
      !ReadStateHelper.hasBuildingsResalePlannedAfterDevelopment(context.stepsState)
    ) {
      return "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES";
    }
    return "URBAN_PROJECT_EXPENSES_INSTALLATION";
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

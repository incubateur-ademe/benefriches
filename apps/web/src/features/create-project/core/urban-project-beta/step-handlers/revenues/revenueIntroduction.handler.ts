import { ReadStateHelper } from "../../helpers/readState";
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
    const siteResalePlannedAfterDevelopment = ReadStateHelper.getStepAnswers(
      context.stepsState,
      "URBAN_PROJECT_SITE_RESALE_SELECTION",
    )?.siteResalePlannedAfterDevelopment;

    if (siteResalePlannedAfterDevelopment) {
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

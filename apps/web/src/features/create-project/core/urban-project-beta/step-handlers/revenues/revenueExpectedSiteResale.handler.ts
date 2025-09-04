import { ReadStateHelper } from "../../urbanProject.helpers";
import { AnswerStepHandler } from "../stepHandler.type";

export const RevenueExpectedSiteResaleHandler: AnswerStepHandler<"URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE"> =
  {
    stepId: "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",

    getPreviousStepId() {
      return "URBAN_PROJECT_REVENUE_INTRODUCTION";
    },

    getNextStepId(context) {
      if (ReadStateHelper.hasBuildings(context.stepsState)) {
        if (ReadStateHelper.hasBuildingsResalePlannedAfterDevelopment(context.stepsState)) {
          return "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE";
        }
        return "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES";
      }

      return "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE";
    },
  };

import { ReadStateHelper } from "../../urbanProject.helpers";
import { AnswerStepHandler } from "../stepHandler.type";

export const RevenueFinancialAssistanceHandler: AnswerStepHandler<"URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE"> =
  {
    stepId: "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE",

    getPreviousStepId(context) {
      if (ReadStateHelper.hasBuildings(context.stepsState)) {
        if (ReadStateHelper.hasBuildingsResalePlannedAfterDevelopment(context.stepsState)) {
          return "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE";
        }
        return "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES";
      }

      const siteResalePlannedAfterDevelopment = ReadStateHelper.getStepAnswers(
        context.stepsState,
        "URBAN_PROJECT_SITE_RESALE_SELECTION",
      )?.siteResalePlannedAfterDevelopment;

      if (siteResalePlannedAfterDevelopment) {
        return "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE";
      }

      return "URBAN_PROJECT_REVENUE_INTRODUCTION";
    },

    getNextStepId() {
      return "URBAN_PROJECT_SCHEDULE_INTRODUCTION";
    },
  };

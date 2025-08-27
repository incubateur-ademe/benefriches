import { FormState } from "../../form-state/formState";
import { AnswerStepHandler } from "../stepHandler.type";

export const RevenueBuildingsOperationsYearlyRevenuesHandler: AnswerStepHandler<"URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES"> =
  {
    stepId: "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",

    getPreviousStepId(context) {
      const siteResalePlannedAfterDevelopment = FormState.getStepAnswers(
        context.urbanProjectEventSourcing.events,
        "URBAN_PROJECT_SITE_RESALE_SELECTION",
      )?.siteResalePlannedAfterDevelopment;

      if (siteResalePlannedAfterDevelopment) {
        return "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE";
      }
      return "URBAN_PROJECT_REVENUE_INTRODUCTION";
    },

    getNextStepId() {
      return "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE";
    },
  };

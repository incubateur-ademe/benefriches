import { FormState } from "../../form-state/formState";
import { AnswerStepHandler } from "../stepHandler.type";

export const RevenueFinancialAssistanceHandler: AnswerStepHandler<"URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE"> =
  {
    stepId: "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE",

    getPreviousStepId(context) {
      if (FormState.hasBuildings(context.urbanProjectEventSourcing.events)) {
        if (
          FormState.hasBuildingsResalePlannedAfterDevelopment(
            context.urbanProjectEventSourcing.events,
          )
        ) {
          return "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE";
        }
        return "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES";
      }

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
      return "URBAN_PROJECT_SCHEDULE_INTRODUCTION";
    },
  };

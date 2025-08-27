import { FormState } from "../../form-state/formState";
import { AnswerStepHandler } from "../stepHandler.type";

export const RevenueExpectedSiteResaleHandler: AnswerStepHandler<"URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE"> =
  {
    stepId: "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",

    getPreviousStepId() {
      return "URBAN_PROJECT_REVENUE_INTRODUCTION";
    },

    getNextStepId(context) {
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

      return "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE";
    },
  };

import { FormState } from "../../form-state/formState";
import { InfoStepHandler } from "../stepHandler.type";

export const RevenueIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_REVENUE_INTRODUCTION",

  getPreviousStepId(context) {
    if (
      FormState.hasBuildings(context.urbanProjectEventSourcing.events) &&
      !FormState.hasBuildingsResalePlannedAfterDevelopment(context.urbanProjectEventSourcing.events)
    ) {
      return "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES";
    }
    return "URBAN_PROJECT_EXPENSES_INSTALLATION";
  },

  getNextStepId(context) {
    const siteResalePlannedAfterDevelopment = FormState.getStepAnswers(
      context.urbanProjectEventSourcing.events,
      "URBAN_PROJECT_SITE_RESALE_SELECTION",
    )?.siteResalePlannedAfterDevelopment;

    if (siteResalePlannedAfterDevelopment) {
      return "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE";
    }

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

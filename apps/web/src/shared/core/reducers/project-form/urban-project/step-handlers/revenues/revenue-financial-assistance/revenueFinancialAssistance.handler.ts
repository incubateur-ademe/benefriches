import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import type { AnswerStepHandler } from "../../stepHandler.type";

export const RevenueFinancialAssistanceHandler = {
  stepId: "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE",

  getPreviousStepId(context) {
    if (ReadStateHelper.willHaveBuildings(context.stepsState)) {
      if (ReadStateHelper.hasBuildingsResalePlannedAfterDevelopment(context.stepsState)) {
        return "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE";
      }
      return "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES";
    }

    if (ReadStateHelper.isSiteResalePlannedAfterDevelopment(context.stepsState)) {
      return "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE";
    }

    return "URBAN_PROJECT_REVENUE_INTRODUCTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SCHEDULE_PROJECTION";
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE">;

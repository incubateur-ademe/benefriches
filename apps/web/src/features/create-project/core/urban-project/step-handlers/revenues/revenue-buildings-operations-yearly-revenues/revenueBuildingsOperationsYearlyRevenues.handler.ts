import { isSiteResalePlannedAfterDevelopment } from "@/features/create-project/core/urban-project/helpers/readers/siteResaleReaders";

import type { AnswerStepHandler } from "../../stepHandler.type";

export const RevenueBuildingsOperationsYearlyRevenuesHandler = {
  stepId: "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",

  getPreviousStepId(params) {
    if (isSiteResalePlannedAfterDevelopment(params.answers)) {
      return "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE";
    }
    return "URBAN_PROJECT_REVENUE_INTRODUCTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE";
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES">;

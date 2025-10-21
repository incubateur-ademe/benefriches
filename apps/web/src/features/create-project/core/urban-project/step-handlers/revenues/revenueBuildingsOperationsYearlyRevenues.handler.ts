import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import { AnswerStepHandler } from "../stepHandler.type";

export const RevenueBuildingsOperationsYearlyRevenuesHandler: AnswerStepHandler<"URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES"> =
  {
    stepId: "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",

    getPreviousStepId(context) {
      if (ReadStateHelper.isSiteResalePlannedAfterDevelopment(context.stepsState)) {
        return "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE";
      }
      return "URBAN_PROJECT_REVENUE_INTRODUCTION";
    },

    getNextStepId() {
      return "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE";
    },
  };

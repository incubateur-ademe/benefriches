import {
  willHaveBuildings,
  hasBuildingsResalePlannedAfterDevelopment,
} from "@/shared/core/reducers/project-form/urban-project/helpers/readers/buildingsReaders";

import type { AnswerStepHandler } from "../../stepHandler.type";

export const RevenueExpectedSiteResaleHandler = {
  stepId: "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",

  getPreviousStepId() {
    return "URBAN_PROJECT_REVENUE_INTRODUCTION";
  },

  getNextStepId(context) {
    if (willHaveBuildings(context.stepsState)) {
      if (hasBuildingsResalePlannedAfterDevelopment(context.stepsState)) {
        return "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE";
      }
      return "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES";
    }

    return "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE";
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE">;

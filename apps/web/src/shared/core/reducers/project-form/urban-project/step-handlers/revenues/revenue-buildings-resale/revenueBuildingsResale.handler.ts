import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import type { AnswerStepHandler } from "../../stepHandler.type";

export const RevenueBuildingsResaleHandler = {
  stepId: "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE",

  getPreviousStepId(context) {
    if (ReadStateHelper.isSiteResalePlannedAfterDevelopment(context.stepsState)) {
      return "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE";
    }

    return "URBAN_PROJECT_REVENUE_INTRODUCTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE";
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_REVENUE_BUILDINGS_RESALE">;

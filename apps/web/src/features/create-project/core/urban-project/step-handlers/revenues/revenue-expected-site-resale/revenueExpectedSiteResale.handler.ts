import { willDeveloperResellBuildings } from "@/features/create-project/core/urban-project/step-handlers/stakeholders/stakeholdersReaders";

import type { AnswerStepHandler } from "../../stepHandler.type";

export const RevenueExpectedSiteResaleHandler = {
  stepId: "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",

  getPreviousStepId() {
    return "URBAN_PROJECT_REVENUE_INTRODUCTION";
  },

  getNextStepId({ answers }) {
    if (willDeveloperResellBuildings(answers)) {
      return "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE";
    }

    return "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE";
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE">;

import { willHaveBuildings } from "@/shared/core/wizard-form/urban-project/helpers/readers/buildingsReaders";

import type { AnswerStepHandler } from "../../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_SITE_RESALE_SELECTION";

export const SiteResaleSelectionHandler = {
  stepId: STEP_ID,

  getNextStepId({ answers }) {
    if (willHaveBuildings(answers)) {
      return "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION";
    }

    return "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION";
  },

  getPreviousStepId() {
    return "URBAN_PROJECT_SITE_RESALE_INTRODUCTION";
  },

  getDependencyRules({ answers }, newAnswers) {
    const siteResalePlanned = newAnswers.siteResaleSelection !== "no";

    if (answers.URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE) {
      return [
        {
          action: siteResalePlanned ? "invalidate" : "delete",
          stepId: "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
        },
      ];
    }
    return [];
  },
} satisfies AnswerStepHandler<typeof STEP_ID>;

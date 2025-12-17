import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import { getFutureSiteOwner } from "../../../helpers/stakeholders";
import { AnswerStepHandler } from "../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_SITE_RESALE_SELECTION";

export const SiteResaleSelectionHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,

  getNextStepId(context) {
    if (ReadStateHelper.hasBuildings(context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION";
    }

    return "URBAN_PROJECT_EXPENSES_INTRODUCTION";
  },

  getPreviousStepId() {
    return "URBAN_PROJECT_SITE_RESALE_INTRODUCTION";
  },

  getDependencyRules(state, newAnswers) {
    if (state.stepsState.URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE) {
      return [
        {
          action: newAnswers.siteResalePlannedAfterDevelopment ? "invalidate" : "delete",
          stepId: "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
        },
      ];
    }
    return [];
  },

  updateAnswersMiddleware(context, answers) {
    const { siteResalePlannedAfterDevelopment } = answers;
    return {
      siteResalePlannedAfterDevelopment,
      futureSiteOwner: siteResalePlannedAfterDevelopment
        ? getFutureSiteOwner(siteResalePlannedAfterDevelopment, context.siteData?.owner)
        : undefined,
    };
  },
} as const;

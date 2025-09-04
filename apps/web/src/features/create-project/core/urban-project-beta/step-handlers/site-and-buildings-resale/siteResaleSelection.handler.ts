import { getFutureSiteOwner } from "../../../stakeholders";
import { ReadStateHelper } from "../../urbanProject.helpers";
import { AnswerStepHandler } from "../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_SITE_RESALE_SELECTION" as const;

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

  getStepsToInvalidate(_, previousAnswers, newAnswers) {
    if (
      previousAnswers.siteResalePlannedAfterDevelopment !==
      newAnswers.siteResalePlannedAfterDevelopment
    ) {
      if (!newAnswers.siteResalePlannedAfterDevelopment) {
        return ["URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE"];
      }
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

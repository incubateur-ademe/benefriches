import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import { getFutureOperator } from "../../../helpers/stakeholders";
import { AnswerStepHandler, StepInvalidationRule } from "../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION";

export const BuildingsResaleSelectionHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,

  getNextStepId() {
    return "URBAN_PROJECT_EXPENSES_INTRODUCTION";
  },

  getPreviousStepId() {
    return "URBAN_PROJECT_SITE_RESALE_SELECTION";
  },

  getDependencyRules(state, newAnswers) {
    const rules: StepInvalidationRule[] = [];
    const hasBuildingResale = newAnswers.buildingsResalePlannedAfterDevelopment;

    if (state.stepsState.URBAN_PROJECT_REVENUE_BUILDINGS_RESALE) {
      rules.push({
        stepId: "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE",
        action: hasBuildingResale ? "invalidate" : "delete",
      });
    }

    if (state.stepsState.URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES) {
      rules.push({
        stepId: "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES",
        action: hasBuildingResale ? "delete" : "invalidate",
      });
    }
    if (state.stepsState.URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES) {
      rules.push({
        stepId: "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
        action: hasBuildingResale ? "delete" : "invalidate",
      });
    }

    return rules;
  },

  updateAnswersMiddleware(context, answers) {
    const { buildingsResalePlannedAfterDevelopment } = answers;

    const projectDeveloper = ReadStateHelper.getStepAnswers(
      context.stepsState,
      "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
    )?.projectDeveloper;

    return {
      buildingsResalePlannedAfterDevelopment,
      futureOperator:
        buildingsResalePlannedAfterDevelopment !== undefined
          ? getFutureOperator(buildingsResalePlannedAfterDevelopment, projectDeveloper)
          : undefined,
    };
  },
} as const;

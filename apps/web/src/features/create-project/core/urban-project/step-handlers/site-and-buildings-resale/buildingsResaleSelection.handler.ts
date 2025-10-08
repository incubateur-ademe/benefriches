import { getFutureOperator } from "../../../stakeholders";
import { ReadStateHelper } from "../../helpers/readState";
import { AnswerStepHandler, StepInvalidationRule } from "../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION" as const;

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

    if (state.stepsState.URBAN_PROJECT_REVENUE_BUILDINGS_RESALE) {
      if (!newAnswers.buildingsResalePlannedAfterDevelopment) {
        rules.push({ stepId: "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE", action: "delete" });
      }
    }

    if (newAnswers.buildingsResalePlannedAfterDevelopment) {
      if (state.stepsState.URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES) {
        rules.push({
          stepId: "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES",
          action: "delete",
        });
      }
      if (state.stepsState.URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES) {
        rules.push({
          stepId: "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES",
          action: "delete",
        });
      }
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
      futureOperator: buildingsResalePlannedAfterDevelopment
        ? getFutureOperator(buildingsResalePlannedAfterDevelopment, projectDeveloper)
        : undefined,
    };
  },
} as const;

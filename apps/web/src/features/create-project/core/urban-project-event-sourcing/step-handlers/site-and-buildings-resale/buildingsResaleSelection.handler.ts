import { getFutureOperator } from "../../../stakeholders";
import { ReadStateHelper } from "../../urbanProject.helpers";
import { AnswerStepId } from "../../urbanProjectSteps";
import { AnswerStepHandler } from "../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION" as const;

export const BuildingsResaleSelectionHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,

  getNextStepId() {
    return "URBAN_PROJECT_EXPENSES_INTRODUCTION";
  },

  getPreviousStepId() {
    return "URBAN_PROJECT_SITE_RESALE_SELECTION";
  },

  getStepsToInvalidate(_, previousAnswers, newAnswers) {
    const steps: AnswerStepId[] = [];
    if (
      previousAnswers.buildingsResalePlannedAfterDevelopment !==
      newAnswers.buildingsResalePlannedAfterDevelopment
    ) {
      if (!newAnswers.buildingsResalePlannedAfterDevelopment) {
        steps.push("URBAN_PROJECT_REVENUE_BUILDINGS_RESALE");
      }

      if (newAnswers.buildingsResalePlannedAfterDevelopment) {
        steps.push("URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES");
        steps.push("URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES");
      }
    }
    return steps;
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

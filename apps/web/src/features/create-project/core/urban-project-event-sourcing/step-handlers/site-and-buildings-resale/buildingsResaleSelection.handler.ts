import { getFutureOperator } from "../../../stakeholders";
import { FormState } from "../../form-state/formState";
import { AnswersByStep } from "../../urbanProjectSteps";
import { BaseAnswerStepHandler } from "../answerStep.handler";
import { StepContext } from "../step.handler";

const STEP_ID = "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION" as const;

export class BuildingsResaleSelectionHandler extends BaseAnswerStepHandler {
  protected override stepId = STEP_ID;

  setDefaultAnswers(): void {}

  handleUpdateSideEffects(
    context: StepContext,
    previousAnswers: AnswersByStep[typeof STEP_ID],
    newAnswers: AnswersByStep[typeof STEP_ID],
  ) {
    if (
      previousAnswers.buildingsResalePlannedAfterDevelopment !==
      newAnswers.buildingsResalePlannedAfterDevelopment
    ) {
      if (!newAnswers.buildingsResalePlannedAfterDevelopment) {
        BaseAnswerStepHandler.addAnswerDeletionEvent(
          context,
          "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE",
        );
      }

      if (newAnswers.buildingsResalePlannedAfterDevelopment) {
        BaseAnswerStepHandler.addAnswerDeletionEvent(
          context,
          "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES",
        );
        BaseAnswerStepHandler.addAnswerDeletionEvent(
          context,
          "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES",
        );
      }
    }
  }
  previous(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_SITE_RESALE_SELECTION");
  }

  next(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_EXPENSES_INTRODUCTION");
  }

  override updateAnswers(
    context: StepContext,
    answers: AnswersByStep["URBAN_PROJECT_BUILDINGS_RESALE_SELECTION"],
    source?: "user" | "system",
  ): void {
    const { buildingsResalePlannedAfterDevelopment } = answers;

    const projectDeveloper = FormState.getStepAnswers(
      context.urbanProjectEventSourcing.events,
      "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
    )?.projectDeveloper;

    BaseAnswerStepHandler.addAnswerEvent<"URBAN_PROJECT_BUILDINGS_RESALE_SELECTION">(
      context,
      "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
      {
        buildingsResalePlannedAfterDevelopment,
        futureOperator: buildingsResalePlannedAfterDevelopment
          ? getFutureOperator(buildingsResalePlannedAfterDevelopment, projectDeveloper)
          : undefined,
      },
      source,
    );
  }
}

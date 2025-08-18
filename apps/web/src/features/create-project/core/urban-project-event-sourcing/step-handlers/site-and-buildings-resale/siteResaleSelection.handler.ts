import { getFutureSiteOwner } from "../../../stakeholders";
import { FormState } from "../../form-state/formState";
import { AnswersByStep, AnswerStepId } from "../../urbanProjectSteps";
import { BaseAnswerStepHandler } from "../answerStep.handler";
import { StepContext } from "../step.handler";

const STEP_ID = "URBAN_PROJECT_SITE_RESALE_SELECTION" as const;

export class SiteResaleSelectionHandler extends BaseAnswerStepHandler {
  protected override stepId: AnswerStepId = STEP_ID;

  setDefaultAnswers(): void {}

  handleUpdateSideEffects(
    context: StepContext,
    previousAnswers: AnswersByStep[typeof STEP_ID],
    newAnswers: AnswersByStep[typeof STEP_ID],
  ) {
    if (
      previousAnswers.siteResalePlannedAfterDevelopment !==
      newAnswers.siteResalePlannedAfterDevelopment
    ) {
      if (!newAnswers.siteResalePlannedAfterDevelopment) {
        BaseAnswerStepHandler.addAnswerDeletionEvent(
          context,
          "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE",
        );
      }
    }
  }

  previous(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
  }

  next(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION");

    if (FormState.hasBuildings(context.urbanProjectEventSourcing.events)) {
      this.navigateTo(context, "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION");
      return;
    }

    this.navigateTo(context, "URBAN_PROJECT_EXPENSES_INTRODUCTION");
  }

  override updateAnswers(
    context: StepContext,
    answers: AnswersByStep[typeof STEP_ID],
    source: "user" | "system" = "user",
  ): void {
    const { siteResalePlannedAfterDevelopment } = answers;

    BaseAnswerStepHandler.addAnswerEvent<typeof STEP_ID>(
      context,
      STEP_ID,
      {
        siteResalePlannedAfterDevelopment,
        futureSiteOwner: siteResalePlannedAfterDevelopment
          ? getFutureSiteOwner(siteResalePlannedAfterDevelopment, context.siteData?.owner)
          : undefined,
      },
      source,
    );
  }
}

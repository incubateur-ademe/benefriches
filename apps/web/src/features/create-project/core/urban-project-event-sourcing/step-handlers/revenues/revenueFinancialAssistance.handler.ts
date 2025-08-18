import { FormState } from "../../form-state/formState";
import { AnswerStepId } from "../../urbanProjectSteps";
import { BaseAnswerStepHandler } from "../answerStep.handler";
import { StepContext } from "../step.handler";

export class RevenueFinancialAssistanceHandler extends BaseAnswerStepHandler {
  protected override stepId: AnswerStepId = "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE";

  setDefaultAnswers(): void {}
  handleUpdateSideEffects(): void {}

  previous(context: StepContext): void {
    if (FormState.hasBuildings(context.urbanProjectEventSourcing.events)) {
      if (
        FormState.hasBuildingsResalePlannedAfterDevelopment(
          context.urbanProjectEventSourcing.events,
        )
      ) {
        this.navigateTo(context, "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE");
        return;
      }
      this.navigateTo(context, "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES");
      return;
    }

    const siteResalePlannedAfterDevelopment = FormState.getStepAnswers(
      context.urbanProjectEventSourcing.events,
      "URBAN_PROJECT_SITE_RESALE_SELECTION",
    )?.siteResalePlannedAfterDevelopment;

    if (siteResalePlannedAfterDevelopment) {
      this.navigateTo(context, "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE");
      return;
    }

    this.navigateTo(context, "URBAN_PROJECT_REVENUE_INTRODUCTION");
  }

  next(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_SCHEDULE_INTRODUCTION");
  }
}

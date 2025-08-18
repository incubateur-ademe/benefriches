import { FormState } from "../../form-state/formState";
import { AnswerStepId } from "../../urbanProjectSteps";
import { BaseAnswerStepHandler } from "../answerStep.handler";
import { StepContext } from "../step.handler";

export class RevenueExpectedSiteResaleHandler extends BaseAnswerStepHandler {
  protected override stepId: AnswerStepId = "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE";

  setDefaultAnswers(): void {}
  handleUpdateSideEffects(): void {}

  previous(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_REVENUE_INTRODUCTION");
  }

  next(context: StepContext): void {
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

    this.navigateTo(context, "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE");
  }
}

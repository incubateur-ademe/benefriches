import { FormState } from "../../form-state/formState";
import { AnswerStepId } from "../../urbanProjectSteps";
import { BaseAnswerStepHandler } from "../answerStep.handler";
import { StepContext } from "../step.handler";

export class PublicSpacesDistributionHandler extends BaseAnswerStepHandler {
  protected override stepId: AnswerStepId = "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION";

  setDefaultAnswers(): void {}

  handleUpdateSideEffects(context: StepContext): void {
    if (
      FormState.hasLastAnswerFromSystem(
        context.urbanProjectEventSourcing.events,
        "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
      )
    ) {
      BaseAnswerStepHandler.addAnswerDeletionEvent(context, "URBAN_PROJECT_EXPENSES_REINSTATEMENT");
    }
  }

  previous(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_PUBLIC_SPACES_INTRODUCTION");
  }

  next(context: StepContext): void {
    const spacesCategoriesDistribution = FormState.getStepAnswers(
      context.urbanProjectEventSourcing.events,
      "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
    )?.spacesCategoriesDistribution;

    if (spacesCategoriesDistribution?.GREEN_SPACES) {
      this.navigateTo(context, "URBAN_PROJECT_GREEN_SPACES_INTRODUCTION");
      return;
    }

    this.navigateTo(context, "URBAN_PROJECT_SPACES_SOILS_SUMMARY");
  }
}

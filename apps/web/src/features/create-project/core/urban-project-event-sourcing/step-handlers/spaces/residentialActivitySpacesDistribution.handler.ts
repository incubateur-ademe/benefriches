import { FormState } from "../../form-state/formState";
import { BUILDINGS_STEPS, AnswersByStep } from "../../urbanProjectSteps";
import { BaseAnswerStepHandler } from "../answerStep.handler";
import { StepContext } from "../step.handler";

const STEP_ID = "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION" as const;

export class ResidentialAndActivitySpacesDistributionHandler extends BaseAnswerStepHandler {
  protected override stepId = STEP_ID;

  setDefaultAnswers(): void {}

  handleUpdateSideEffects(
    context: StepContext,
    previousAnswers: AnswersByStep[typeof STEP_ID],
    newAnswers: AnswersByStep[typeof STEP_ID],
  ) {
    if (
      previousAnswers.livingAndActivitySpacesDistribution?.BUILDINGS !==
      newAnswers.livingAndActivitySpacesDistribution?.BUILDINGS
    ) {
      if (!newAnswers.livingAndActivitySpacesDistribution?.BUILDINGS) {
        BUILDINGS_STEPS.forEach((stepId) => {
          BaseAnswerStepHandler.addAnswerDeletionEvent(context, stepId);
        });
      }
    }

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
    this.navigateTo(context, "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_INTRODUCTION");
  }

  next(context: StepContext): void {
    const spacesCategoriesDistribution = FormState.getStepAnswers(
      context.urbanProjectEventSourcing.events,
      "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
    )?.spacesCategoriesDistribution;

    if (spacesCategoriesDistribution?.PUBLIC_SPACES) {
      this.navigateTo(context, "URBAN_PROJECT_PUBLIC_SPACES_INTRODUCTION");
      return;
    }

    if (spacesCategoriesDistribution?.GREEN_SPACES) {
      this.navigateTo(context, "URBAN_PROJECT_GREEN_SPACES_INTRODUCTION");
      return;
    }

    this.navigateTo(context, "URBAN_PROJECT_SPACES_SOILS_SUMMARY");
  }
}

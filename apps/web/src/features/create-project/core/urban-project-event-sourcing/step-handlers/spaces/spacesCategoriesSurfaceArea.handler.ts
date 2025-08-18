import { FormState } from "../../form-state/formState";
import { BUILDINGS_STEPS, AnswersByStep } from "../../urbanProjectSteps";
import { BaseAnswerStepHandler } from "../answerStep.handler";
import { StepContext } from "../step.handler";

const STEP_ID = "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA" as const;

export class UrbanProjectSpacesCategoriesSurfaceAreaHandler extends BaseAnswerStepHandler<
  typeof STEP_ID
> {
  protected override stepId = STEP_ID;

  setDefaultAnswers(): void {}

  handleUpdateSideEffects(
    context: StepContext,
    previousAnswers: AnswersByStep[typeof STEP_ID],
    newAnswers: AnswersByStep[typeof STEP_ID],
  ) {
    if (
      previousAnswers.spacesCategoriesDistribution?.GREEN_SPACES !==
      newAnswers.spacesCategoriesDistribution?.GREEN_SPACES
    ) {
      if (!newAnswers.spacesCategoriesDistribution?.GREEN_SPACES) {
        BaseAnswerStepHandler.addAnswerDeletionEvent(
          context,
          "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
        );
      }
    }

    if (
      previousAnswers.spacesCategoriesDistribution?.PUBLIC_SPACES !==
      newAnswers.spacesCategoriesDistribution?.PUBLIC_SPACES
    ) {
      if (!newAnswers.spacesCategoriesDistribution?.PUBLIC_SPACES) {
        BaseAnswerStepHandler.addAnswerDeletionEvent(
          context,
          "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",
        );
      }
    }

    if (
      previousAnswers.spacesCategoriesDistribution?.LIVING_AND_ACTIVITY_SPACES !==
      newAnswers.spacesCategoriesDistribution?.LIVING_AND_ACTIVITY_SPACES
    ) {
      if (!newAnswers.spacesCategoriesDistribution?.LIVING_AND_ACTIVITY_SPACES) {
        const hasBuilding = FormState.hasBuildings(context.urbanProjectEventSourcing.events);
        BaseAnswerStepHandler.addAnswerDeletionEvent(
          context,
          "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
        );
        if (hasBuilding) {
          BUILDINGS_STEPS.forEach((stepId) => {
            BaseAnswerStepHandler.addAnswerDeletionEvent(context, stepId);
          });
        }
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
    this.navigateTo(context, "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION");
  }

  next(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION");
  }
}

import { UrbanSpaceCategory } from "shared";

import { FormState } from "../../form-state/formState";
import { BUILDINGS_STEPS, AnswersByStep } from "../../urbanProjectSteps";
import { BaseAnswerStepHandler } from "../answerStep.handler";
import { StepContext } from "../step.handler";

const STEP_ID = "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION" as const;

export class UrbanProjectSpacesCategoriesSelectionHandler extends BaseAnswerStepHandler<
  typeof STEP_ID
> {
  protected override stepId = STEP_ID;

  setDefaultAnswers(): void {}

  previous(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION");
  }

  next(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA");
  }

  handleUpdateSideEffects(
    context: StepContext,
    previousAnswers: AnswersByStep[typeof STEP_ID],
    newAnswers: AnswersByStep[typeof STEP_ID],
  ) {
    BaseAnswerStepHandler.addAnswerDeletionEvent(
      context,
      "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
    );

    if (
      previousAnswers.spacesCategories?.includes("GREEN_SPACES") &&
      !newAnswers.spacesCategories?.includes("GREEN_SPACES")
    ) {
      BaseAnswerStepHandler.addAnswerDeletionEvent(
        context,
        "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
      );
    }

    if (
      previousAnswers.spacesCategories?.includes("PUBLIC_SPACES") &&
      !newAnswers.spacesCategories?.includes("PUBLIC_SPACES")
    ) {
      BaseAnswerStepHandler.addAnswerDeletionEvent(
        context,
        "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",
      );
    }

    if (
      previousAnswers.spacesCategories?.includes("LIVING_AND_ACTIVITY_SPACES") &&
      !newAnswers.spacesCategories?.includes("LIVING_AND_ACTIVITY_SPACES")
    ) {
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

    if (
      FormState.hasLastAnswerFromSystem(
        context.urbanProjectEventSourcing.events,
        "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
      )
    ) {
      BaseAnswerStepHandler.addAnswerDeletionEvent(context, "URBAN_PROJECT_EXPENSES_REINSTATEMENT");
    }
  }

  override complete(context: StepContext, answers: AnswersByStep[typeof STEP_ID]): void {
    const previousAnswers = this.getAnswers(context);

    const hasChanged = !previousAnswers || !this.isSameAnswers(previousAnswers, answers);

    if (hasChanged) {
      this.updateAnswers(context, answers);

      if (previousAnswers) this.handleUpdateSideEffects(context, previousAnswers, answers);
    }

    if (answers.spacesCategories?.length === 1 && answers.spacesCategories[0]) {
      this.handleSingleCategoryShortcut(context, answers.spacesCategories[0]);
      return;
    }

    this.next(context);
  }

  private handleSingleCategoryShortcut(
    context: StepContext,
    spaceCategory: UrbanSpaceCategory,
  ): void {
    BaseAnswerStepHandler.addAnswerEvent(
      context,
      "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
      {
        spacesCategoriesDistribution: {
          [spaceCategory]: context.siteData?.surfaceArea,
        },
      },
      "system",
    );
    this.navigateTo(context, "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION");
  }
}

import { AnswerStepId } from "../../urbanProjectSteps";
import { BaseAnswerStepHandler } from "../answerStep.handler";
import { StepContext } from "../step.handler";

export class BuildingsFloorSurfaceAreaHandler extends BaseAnswerStepHandler {
  protected override stepId: AnswerStepId = "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA";

  setDefaultAnswers(): void {}
  handleUpdateSideEffects(): void {}

  previous(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_BUILDINGS_INTRODUCTION");
  }

  next(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION");
  }
}

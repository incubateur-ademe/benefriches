import { AnswerStepId } from "../../urbanProjectSteps";
import { BaseAnswerStepHandler } from "../answerStep.handler";
import { StepContext } from "../step.handler";

export class ProjectPhaseHandler extends BaseAnswerStepHandler {
  protected override stepId: AnswerStepId = "URBAN_PROJECT_PROJECT_PHASE";

  setDefaultAnswers(): void {}
  handleUpdateSideEffects(): void {}

  previous(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_SCHEDULE_PROJECTION");
  }

  next(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_NAMING");
  }
}

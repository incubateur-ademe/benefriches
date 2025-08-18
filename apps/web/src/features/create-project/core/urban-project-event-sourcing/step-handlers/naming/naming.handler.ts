import { generateUrbanProjectName } from "../../../projectName";
import { AnswerStepId } from "../../urbanProjectSteps";
import { BaseAnswerStepHandler } from "../answerStep.handler";
import { StepContext } from "../step.handler";

export class UrbanProjectNamingHandler extends BaseAnswerStepHandler {
  protected override stepId: AnswerStepId = "URBAN_PROJECT_NAMING";

  handleUpdateSideEffects(): void {}

  setDefaultAnswers(context: StepContext): void {
    this.updateAnswers(
      context,
      {
        name: generateUrbanProjectName(),
      },
      "system",
    );
  }

  previous(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_PROJECT_PHASE");
  }

  next(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_FINAL_SUMMARY");
  }
}

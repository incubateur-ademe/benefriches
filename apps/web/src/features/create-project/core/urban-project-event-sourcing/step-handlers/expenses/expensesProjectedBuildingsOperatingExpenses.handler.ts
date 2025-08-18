import { AnswerStepId } from "../../urbanProjectSteps";
import { BaseAnswerStepHandler } from "../answerStep.handler";
import { StepContext } from "../step.handler";

export class ExpensesProjectedBuildingsOperatingExpensesHandler extends BaseAnswerStepHandler {
  protected override stepId: AnswerStepId =
    "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES";

  setDefaultAnswers(): void {}
  handleUpdateSideEffects(): void {}

  previous(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_EXPENSES_INSTALLATION");
  }

  next(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_REVENUE_INTRODUCTION");
  }
}

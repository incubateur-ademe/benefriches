import { AnswerStepId } from "../../urbanProjectSteps";
import { BaseAnswerStepHandler } from "../answerStep.handler";
import { StepContext } from "../step.handler";

export class ExpensesSitePurchaseAmountsHandler extends BaseAnswerStepHandler {
  protected override stepId: AnswerStepId = "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS";

  setDefaultAnswers(): void {}
  handleUpdateSideEffects(): void {}

  previous(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_EXPENSES_INTRODUCTION");
  }

  next(context: StepContext): void {
    if (context.siteData?.nature === "FRICHE") {
      this.navigateTo(context, "URBAN_PROJECT_EXPENSES_REINSTATEMENT");
      return;
    }
    this.navigateTo(context, "URBAN_PROJECT_EXPENSES_INSTALLATION");
  }
}

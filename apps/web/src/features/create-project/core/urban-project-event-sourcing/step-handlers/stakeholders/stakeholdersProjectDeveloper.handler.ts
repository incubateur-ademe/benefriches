import { AnswerStepId } from "../../urbanProjectSteps";
import { BaseAnswerStepHandler } from "../answerStep.handler";
import { StepContext } from "../step.handler";

export class StakeholdersProjectDeveloperHandler extends BaseAnswerStepHandler {
  protected override stepId: AnswerStepId = "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER";

  setDefaultAnswers(): void {}
  handleUpdateSideEffects(): void {}

  previous(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION");
  }

  next(context: StepContext): void {
    if (context.siteData?.nature === "FRICHE") {
      this.navigateTo(context, "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER");
      return;
    }

    this.navigateTo(context, "URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
  }
}

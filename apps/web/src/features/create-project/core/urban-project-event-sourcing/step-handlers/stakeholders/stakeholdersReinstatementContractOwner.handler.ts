import { AnswerStepId } from "../../urbanProjectSteps";
import { BaseAnswerStepHandler } from "../answerStep.handler";
import { StepContext } from "../step.handler";

export class StakeholdersReinstatementContractOwnerHandler extends BaseAnswerStepHandler {
  protected override stepId: AnswerStepId =
    "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER";

  setDefaultAnswers(): void {}
  handleUpdateSideEffects(): void {}

  previous(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER");
  }

  next(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
  }
}

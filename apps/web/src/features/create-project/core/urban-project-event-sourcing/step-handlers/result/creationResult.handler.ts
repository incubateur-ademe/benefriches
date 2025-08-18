import { BaseStepHandler, StepContext } from "../step.handler";

export class CreationResultHandler extends BaseStepHandler {
  protected override readonly stepId = "URBAN_PROJECT_CREATION_RESULT";

  previous(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_FINAL_SUMMARY");
  }

  next(): void {}
}

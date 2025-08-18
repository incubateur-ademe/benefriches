import { BaseStepHandler, StepContext } from "../step.handler";

export class FinalSummaryHandler extends BaseStepHandler {
  protected override readonly stepId = "URBAN_PROJECT_FINAL_SUMMARY";

  previous(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_NAMING");
  }

  next(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_CREATION_RESULT");
  }
}

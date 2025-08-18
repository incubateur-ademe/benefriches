import { UrbanProjectCustomCreationStep } from "../../../urban-project/creationSteps";
import { BaseStepHandler, StepContext } from "../step.handler";

export class ScheduleIntroductionHandler extends BaseStepHandler {
  protected override readonly stepId: UrbanProjectCustomCreationStep =
    "URBAN_PROJECT_SCHEDULE_INTRODUCTION";

  previous(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE");
  }

  next(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_SCHEDULE_PROJECTION");
  }
}

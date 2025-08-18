import { UrbanProjectCustomCreationStep } from "../../../urban-project/creationSteps";
import { BaseStepHandler, StepContext } from "../step.handler";

export class BuildingsUseIntroductionHandler extends BaseStepHandler {
  protected override readonly stepId: UrbanProjectCustomCreationStep =
    "URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION";

  previous(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA");
  }
  next(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION");
  }
}

import { UrbanProjectCustomCreationStep } from "../../../urban-project/creationSteps";
import { BaseStepHandler, StepContext } from "../step.handler";

export class SoilsDecontaminationIntroductionHandler extends BaseStepHandler {
  protected override readonly stepId: UrbanProjectCustomCreationStep =
    "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION";

  previous(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_SOILS_CARBON_SUMMARY");
  }

  next(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION");
  }
}

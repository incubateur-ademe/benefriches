import { UrbanProjectCustomCreationStep } from "../../../urban-project/creationSteps";
import { BaseStepHandler, StepContext } from "../step.handler";

export class SiteResaleIntroductionHandler extends BaseStepHandler {
  protected override readonly stepId: UrbanProjectCustomCreationStep =
    "URBAN_PROJECT_SITE_RESALE_INTRODUCTION";

  previous(context: StepContext): void {
    if (context.siteData?.nature === "FRICHE") {
      this.navigateTo(context, "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER");
      return;
    }

    this.navigateTo(context, "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER");
  }

  next(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_SITE_RESALE_SELECTION");
  }
}

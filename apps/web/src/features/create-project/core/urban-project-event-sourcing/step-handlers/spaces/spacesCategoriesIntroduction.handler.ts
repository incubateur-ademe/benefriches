import { UrbanProjectCustomCreationStep } from "../../../urban-project/creationSteps";
import { BaseStepHandler, StepContext } from "../step.handler";

export class SpacesCategoriesIntroductionHandler extends BaseStepHandler {
  protected override readonly stepId: UrbanProjectCustomCreationStep =
    "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION";

  override previous(context: StepContext): void {
    context.urbanProject.createMode = undefined;
  }

  override next(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION");
  }
}

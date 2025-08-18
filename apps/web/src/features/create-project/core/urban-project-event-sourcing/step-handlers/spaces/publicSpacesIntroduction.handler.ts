import { UrbanProjectCustomCreationStep } from "../../../urban-project/creationSteps";
import { FormState } from "../../form-state/formState";
import { BaseStepHandler, StepContext } from "../step.handler";

export class PublicSpacesIntroductionHandler extends BaseStepHandler {
  protected override readonly stepId: UrbanProjectCustomCreationStep =
    "URBAN_PROJECT_PUBLIC_SPACES_INTRODUCTION";

  previous(context: StepContext): void {
    const spacesCategoriesDistribution = FormState.getStepAnswers(
      context.urbanProjectEventSourcing.events,
      "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
    )?.spacesCategoriesDistribution;

    if (spacesCategoriesDistribution?.LIVING_AND_ACTIVITY_SPACES) {
      this.navigateTo(context, "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION");
      return;
    }

    this.navigateTo(context, "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION");
  }

  next(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION");
  }
}

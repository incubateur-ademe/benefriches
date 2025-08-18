import { UrbanProjectCustomCreationStep } from "../../../urban-project/creationSteps";
import { FormState } from "../../form-state/formState";
import { BaseStepHandler, StepContext } from "../step.handler";

export class SoilsSummaryHandler extends BaseStepHandler {
  protected override readonly stepId: UrbanProjectCustomCreationStep =
    "URBAN_PROJECT_SPACES_SOILS_SUMMARY";

  previous(context: StepContext): void {
    const spacesCategoriesDistribution = FormState.getStepAnswers(
      context.urbanProjectEventSourcing.events,
      "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
    )?.spacesCategoriesDistribution;

    if (spacesCategoriesDistribution?.GREEN_SPACES) {
      this.navigateTo(context, "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION");
      return;
    }

    if (spacesCategoriesDistribution?.PUBLIC_SPACES) {
      this.navigateTo(context, "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION");
      return;
    }

    if (spacesCategoriesDistribution?.LIVING_AND_ACTIVITY_SPACES) {
      this.navigateTo(context, "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION");
      return;
    }

    this.navigateTo(context, "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION");
  }

  next(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_SOILS_CARBON_SUMMARY");
  }
}

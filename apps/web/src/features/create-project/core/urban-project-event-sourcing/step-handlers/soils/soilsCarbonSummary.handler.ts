import { UrbanProjectCustomCreationStep } from "../../../urban-project/creationSteps";
import { FormState } from "../../form-state/formState";
import { BaseStepHandler, StepContext } from "../step.handler";

export class SoilsCarbonSummaryHandler extends BaseStepHandler {
  protected override readonly stepId: UrbanProjectCustomCreationStep =
    "URBAN_PROJECT_SOILS_CARBON_SUMMARY";

  previous(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_SPACES_SOILS_SUMMARY");
  }

  next(context: StepContext): void {
    if (context.siteData?.hasContaminatedSoils) {
      this.navigateTo(context, "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION");
      return;
    }

    const livingAndActivitySpacesDistribution = FormState.getStepAnswers(
      context.urbanProjectEventSourcing.events,
      "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
    )?.livingAndActivitySpacesDistribution;

    if (
      livingAndActivitySpacesDistribution?.BUILDINGS &&
      livingAndActivitySpacesDistribution.BUILDINGS > 0
    ) {
      this.navigateTo(context, "URBAN_PROJECT_BUILDINGS_INTRODUCTION");
      return;
    }

    this.navigateTo(context, "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION");
  }
}

import { FormState } from "../../form-state/formState";
import { BaseStepHandler, StepContext } from "../step.handler";

export class StakeholdersIntroductionHandler extends BaseStepHandler {
  protected override readonly stepId = "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION";

  previous(context: StepContext): void {
    const livingAndActivitySpacesDistribution = FormState.getStepAnswers(
      context.urbanProjectEventSourcing.events,
      "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
    )?.livingAndActivitySpacesDistribution;

    if (
      livingAndActivitySpacesDistribution?.BUILDINGS &&
      livingAndActivitySpacesDistribution.BUILDINGS > 0
    ) {
      this.navigateTo(context, "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION");
      return;
    }

    const decontaminationPlan = FormState.getStepAnswers(
      context.urbanProjectEventSourcing.events,
      "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
    )?.decontaminationPlan;

    if (decontaminationPlan === "partial") {
      this.navigateTo(context, "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA");
      return;
    }

    if (context.siteData?.hasContaminatedSoils) {
      this.navigateTo(context, "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION");
      return;
    }

    this.navigateTo(context, "URBAN_PROJECT_SOILS_CARBON_SUMMARY");
  }

  next(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER");
  }
}

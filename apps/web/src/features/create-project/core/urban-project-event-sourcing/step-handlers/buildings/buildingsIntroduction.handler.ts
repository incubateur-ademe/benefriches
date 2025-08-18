import { UrbanProjectCustomCreationStep } from "../../../urban-project/creationSteps";
import { FormState } from "../../form-state/formState";
import { BaseStepHandler, StepContext } from "../step.handler";

export class BuildingsIntroductionHandler extends BaseStepHandler {
  protected override readonly stepId: UrbanProjectCustomCreationStep =
    "URBAN_PROJECT_BUILDINGS_INTRODUCTION";

  previous(context: StepContext): void {
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
    this.navigateTo(context, "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA");
  }
}

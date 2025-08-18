import { UrbanProjectCustomCreationStep } from "../../../urban-project/creationSteps";
import { FormState } from "../../form-state/formState";
import { BaseStepHandler, StepContext } from "../step.handler";

export class ExpensesIntroductionHandler extends BaseStepHandler {
  protected override readonly stepId: UrbanProjectCustomCreationStep =
    "URBAN_PROJECT_EXPENSES_INTRODUCTION";

  previous(context: StepContext): void {
    const livingAndActivitySpacesDistribution = FormState.getStepAnswers(
      context.urbanProjectEventSourcing.events,
      "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
    )?.livingAndActivitySpacesDistribution;

    if (
      livingAndActivitySpacesDistribution?.BUILDINGS &&
      livingAndActivitySpacesDistribution.BUILDINGS > 0
    ) {
      this.navigateTo(context, "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION");
      return;
    }
    this.navigateTo(context, "URBAN_PROJECT_SITE_RESALE_SELECTION");
  }

  next(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS");
  }
}

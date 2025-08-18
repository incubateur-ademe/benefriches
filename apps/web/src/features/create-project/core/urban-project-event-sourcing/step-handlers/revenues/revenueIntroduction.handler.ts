import { UrbanProjectCustomCreationStep } from "../../../urban-project/creationSteps";
import { FormState } from "../../form-state/formState";
import { BaseStepHandler, StepContext } from "../step.handler";

export class RevenueIntroductionHandler extends BaseStepHandler {
  protected override readonly stepId: UrbanProjectCustomCreationStep =
    "URBAN_PROJECT_REVENUE_INTRODUCTION";

  previous(context: StepContext): void {
    if (
      FormState.hasBuildings(context.urbanProjectEventSourcing.events) &&
      !FormState.hasBuildingsResalePlannedAfterDevelopment(context.urbanProjectEventSourcing.events)
    ) {
      this.navigateTo(context, "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES");
      return;
    }
    this.navigateTo(context, "URBAN_PROJECT_EXPENSES_INSTALLATION");
  }

  next(context: StepContext): void {
    const siteResalePlannedAfterDevelopment = FormState.getStepAnswers(
      context.urbanProjectEventSourcing.events,
      "URBAN_PROJECT_SITE_RESALE_SELECTION",
    )?.siteResalePlannedAfterDevelopment;

    if (siteResalePlannedAfterDevelopment) {
      this.navigateTo(context, "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE");
      return;
    }

    if (FormState.hasBuildings(context.urbanProjectEventSourcing.events)) {
      if (
        FormState.hasBuildingsResalePlannedAfterDevelopment(
          context.urbanProjectEventSourcing.events,
        )
      ) {
        this.navigateTo(context, "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE");
        return;
      }
      this.navigateTo(context, "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES");
      return;
    }

    this.navigateTo(context, "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE");
  }
}

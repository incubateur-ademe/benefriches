import { computeProjectReinstatementExpenses } from "shared";

import { FormState } from "../../form-state/formState";
import { AnswerStepId } from "../../urbanProjectSteps";
import { BaseAnswerStepHandler } from "../answerStep.handler";
import { StepContext } from "../step.handler";

export class UrbanProjectReinstatementExpensesHandler extends BaseAnswerStepHandler {
  protected readonly stepId: AnswerStepId = "URBAN_PROJECT_EXPENSES_REINSTATEMENT";

  handleUpdateSideEffects(): void {}

  setDefaultAnswers(context: StepContext): void {
    const soilsDistribution = FormState.getProjectSoilDistribution(
      context.urbanProjectEventSourcing.events,
    );
    const decontaminatedSurface =
      FormState.getStepAnswers<"URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA">(
        context.urbanProjectEventSourcing.events,
        "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
      )?.decontaminatedSurfaceArea;

    const expenses = computeProjectReinstatementExpenses(
      context.siteData?.soilsDistribution ?? {},
      soilsDistribution,
      decontaminatedSurface ?? 0,
    );

    this.updateAnswers(
      context,
      {
        reinstatementExpenses: [
          { purpose: "asbestos_removal", amount: expenses.asbestosRemoval ?? 0 },
          { purpose: "deimpermeabilization", amount: expenses.deimpermeabilization ?? 0 },
          { purpose: "demolition", amount: expenses.demolition ?? 0 },
          {
            purpose: "sustainable_soils_reinstatement",
            amount: expenses.sustainableSoilsReinstatement ?? 0,
          },
          { purpose: "remediation", amount: expenses.remediation ?? 0 },
        ],
      },
      "system",
    );
  }

  previous(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS");
  }

  next(context: StepContext): void {
    this.navigateTo(context, "URBAN_PROJECT_EXPENSES_INSTALLATION");
  }
}

import { computeProjectReinstatementExpenses } from "shared";

import { FormState } from "../../form-state/formState";
import { AnswerStepHandler } from "../stepHandler.type";

export const UrbanProjectReinstatementExpensesHandler: AnswerStepHandler<"URBAN_PROJECT_EXPENSES_REINSTATEMENT"> =
  {
    stepId: "URBAN_PROJECT_EXPENSES_REINSTATEMENT",

    getDefaultAnswers(context) {
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

      return {
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
      };
    },

    getPreviousStepId() {
      return "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS";
    },

    getNextStepId() {
      return "URBAN_PROJECT_EXPENSES_INSTALLATION";
    },
  };

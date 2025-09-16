import { ComputedReinstatementExpenses, computeProjectReinstatementExpenses } from "shared";

import { ReadStateHelper } from "../../helpers/readState";
import { AnswersByStep } from "../../urbanProjectSteps";
import { AnswerStepHandler, StepContext } from "../stepHandler.type";

const getDefaultReinstatementExpenses = (context: StepContext) => {
  const soilsDistribution = ReadStateHelper.getProjectSoilDistribution(context.stepsState);
  const decontaminatedSurface = ReadStateHelper.getStepAnswers(
    context.stepsState,
    "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
  )?.decontaminatedSurfaceArea;

  return computeProjectReinstatementExpenses(
    context.siteData?.soilsDistribution ?? {},
    soilsDistribution,
    decontaminatedSurface ?? 0,
  );
};

const formatDefaultValue = (
  expenses: ComputedReinstatementExpenses,
): AnswersByStep["URBAN_PROJECT_EXPENSES_REINSTATEMENT"] => {
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
};

export const UrbanProjectReinstatementExpensesHandler: AnswerStepHandler<"URBAN_PROJECT_EXPENSES_REINSTATEMENT"> =
  {
    stepId: "URBAN_PROJECT_EXPENSES_REINSTATEMENT",

    getDefaultAnswers(context) {
      return formatDefaultValue(getDefaultReinstatementExpenses(context));
    },

    getRecomputedStepAnswers(context) {
      const oldStepState = ReadStateHelper.getStep(
        context.stepsState,
        "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
      );
      const expenses = getDefaultReinstatementExpenses(context);

      if (!oldStepState) {
        return formatDefaultValue(expenses);
      }

      const oldDefaultValuesMap = new Map(
        oldStepState.defaultValues?.reinstatementExpenses?.map((e) => [e.purpose, e.amount]) ?? [],
      );

      const newDefaultExpensesMap = new Map([
        ["asbestos_removal", expenses.asbestosRemoval ?? 0],
        ["deimpermeabilization", expenses.deimpermeabilization ?? 0],
        ["demolition", expenses.demolition ?? 0],
        ["sustainable_soils_reinstatement", expenses.sustainableSoilsReinstatement ?? 0],
        ["remediation", expenses.remediation ?? 0],
      ]);

      const reinstatementExpenses =
        oldStepState.payload?.reinstatementExpenses?.map((oldExpense) => {
          const oldValueIsDefault =
            oldExpense.amount === oldDefaultValuesMap.get(oldExpense.purpose);

          if (oldValueIsDefault) {
            const newAmount = newDefaultExpensesMap.get(oldExpense.purpose);
            return { purpose: oldExpense.purpose, amount: newAmount ?? 0 };
          }

          return oldExpense;
        }) ?? [];

      return { reinstatementExpenses };
    },

    getPreviousStepId() {
      return "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS";
    },

    getNextStepId() {
      return "URBAN_PROJECT_EXPENSES_INSTALLATION";
    },
  };

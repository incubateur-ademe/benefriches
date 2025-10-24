import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";
import { BUILDINGS_STEPS } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";

import { StepContext, StepInvalidationRule } from "../stepHandler.type";

export const getDeleteBuildingsRules = (context: StepContext) => {
  return BUILDINGS_STEPS.reduce<StepInvalidationRule[]>((rules, stepId) => {
    if (ReadStateHelper.getStep(context.stepsState, stepId)) {
      return [...rules, { stepId, action: "delete" }];
    }
    return rules;
  }, []);
};

export const getReinstatementCostsRecomputationRules = (
  context: StepContext,
): StepInvalidationRule[] => {
  const reinstatementExpensesStep = ReadStateHelper.getStep(
    context.stepsState,
    "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
  );
  if (reinstatementExpensesStep) {
    const hasGeneratedValues = reinstatementExpensesStep.payload?.reinstatementExpenses?.some(
      (expense) => {
        const defaultValue = reinstatementExpensesStep.defaultValues?.reinstatementExpenses?.find(
          (e) => e.purpose === expense.purpose,
        );
        return expense.amount === defaultValue?.amount;
      },
    );
    return hasGeneratedValues
      ? [{ stepId: "URBAN_PROJECT_EXPENSES_REINSTATEMENT", action: "recompute" }]
      : [];
  }
  return [];
};

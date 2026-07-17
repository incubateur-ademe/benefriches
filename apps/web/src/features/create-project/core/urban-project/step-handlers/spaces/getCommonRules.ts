import { BUILDINGS_STEPS } from "@/features/create-project/core/urban-project/urbanProjectSteps";
import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

import { StepHandlerParams, StepInvalidationRule } from "../stepHandler.type";

export const getDeleteBuildingsRules = (params: StepHandlerParams) => {
  return BUILDINGS_STEPS.reduce<StepInvalidationRule[]>((rules, stepId) => {
    if (ReadStateHelper.getStep(params.answers, stepId)) {
      return [...rules, { stepId, action: "delete" }];
    }
    return rules;
  }, []);
};

export const getReinstatementCostsRecomputationRules = (
  params: StepHandlerParams,
): StepInvalidationRule[] => {
  const reinstatementExpensesStep = ReadStateHelper.getStep(
    params.answers,
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

import {
  ReinstatementExpense,
  ReinstatementExpensePurpose,
  ComputedReinstatementCosts,
} from "shared";

import { typedObjectKeys } from "@/shared/core/object-keys/objectKeys";

import { FormValues } from "./ReinstatementCostsForm";

const formValuesExpensesMap = {
  asbestosRemovalAmount: "asbestos_removal",
  deimpermeabilizationAmount: "deimpermeabilization",
  demolitionAmount: "demolition",
  otherReinstatementExpenseAmount: "other_reinstatement",
  remediationAmount: "remediation",
  sustainableSoilsReinstatementAmount: "sustainable_soils_reinstatement",
  wasteCollectionAmount: "waste_collection",
} as const satisfies Record<keyof FormValues, ReinstatementExpense["purpose"]>;

const expensesToFormValuesMap = {
  asbestos_removal: "asbestosRemovalAmount",
  deimpermeabilization: "deimpermeabilizationAmount",
  demolition: "demolitionAmount",
  other_reinstatement: "otherReinstatementExpenseAmount",
  remediation: "remediationAmount",
  sustainable_soils_reinstatement: "sustainableSoilsReinstatementAmount",
  waste_collection: "wasteCollectionAmount",
} as const satisfies Record<ReinstatementExpensePurpose, keyof FormValues>;

export const mapFormValuesToReinstatementExpenses = (
  amounts: FormValues,
): ReinstatementExpense[] => {
  return typedObjectKeys(amounts)
    .filter((amountKey) => !!amounts[amountKey])
    .map((sourceKey) => ({
      purpose: formValuesExpensesMap[sourceKey],
      amount: amounts[sourceKey] as number,
    }));
};

export const mapInitialValues = (
  preEnteredData: ReinstatementExpense[] | undefined,
  defaultReinstatementExpenses: ComputedReinstatementCosts,
): FormValues => {
  if (preEnteredData) {
    return preEnteredData.reduce<FormValues>((acc, cur) => {
      return { ...acc, [expensesToFormValuesMap[cur.purpose]]: cur.amount };
    }, {});
  }

  const {
    asbestosRemoval,
    demolition,
    remediation,
    deimpermeabilization,
    sustainableSoilsReinstatement,
  } = defaultReinstatementExpenses;
  return {
    deimpermeabilizationAmount: deimpermeabilization && Math.round(deimpermeabilization),
    sustainableSoilsReinstatementAmount:
      sustainableSoilsReinstatement && Math.round(sustainableSoilsReinstatement),
    remediationAmount: remediation && Math.round(remediation),
    demolitionAmount: demolition && Math.round(demolition),
    asbestosRemovalAmount: asbestosRemoval && Math.round(asbestosRemoval),
  };
};

import { ReinstatementExpense } from "shared";

import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";

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

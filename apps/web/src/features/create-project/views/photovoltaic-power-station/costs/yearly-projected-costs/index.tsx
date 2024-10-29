import { AppDispatch } from "@/app/application/store";
import {
  completeYearlyProjectedExpenses,
  revertYearlyProjectedExpenses,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import { getDefaultValuesForYearlyProjectedExpenses } from "@/features/create-project/application/renewable-energy/renewableEnergy.selector";
import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import YearlyProjectedsExpensesForm, { FormValues } from "./YearlyProjectedCostsForm";

const expensesFormMap = {
  rentAmount: "rent",
  maintenanceAmount: "maintenance",
  taxesAmount: "taxes",
  otherAmount: "other",
} as const;

const mapProps = (
  dispatch: AppDispatch,
  defaultValues?: { rent: number; maintenance: number; taxes: number },
) => {
  return {
    defaultValues,
    onSubmit: (expenses: FormValues) => {
      const yearlyProjectedExpenses = typedObjectKeys(expenses)
        .filter((sourceKey) => !!expenses[sourceKey])
        .map((sourceKey) => ({
          purpose: expensesFormMap[sourceKey],
          amount: expenses[sourceKey] as number,
        }));
      dispatch(completeYearlyProjectedExpenses(yearlyProjectedExpenses));
    },
    onBack: () => {
      dispatch(revertYearlyProjectedExpenses());
    },
  };
};

function YearlyProjectedExpensesFormContainer() {
  const dispatch = useAppDispatch();
  const defaultValues = useAppSelector(getDefaultValuesForYearlyProjectedExpenses);

  return <YearlyProjectedsExpensesForm {...mapProps(dispatch, defaultValues)} />;
}

export default YearlyProjectedExpensesFormContainer;

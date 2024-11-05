import { RecurringExpense } from "shared";

import {
  yearlyProjectedExpensesCompleted,
  yearlyProjectedExpensesReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import YearlyProjectedExpensesForm from "@/features/create-project/views/common-views/costs/yearly-projected-costs";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function YearlyProjectedExpensesFormContainer() {
  const dispatch = useAppDispatch();

  return (
    <YearlyProjectedExpensesForm
      title="Dépenses annuelles d’exploitation des bâtiments"
      onSubmit={(expenses: RecurringExpense[]) => {
        dispatch(yearlyProjectedExpensesCompleted(expenses));
      }}
      onBack={() => {
        dispatch(yearlyProjectedExpensesReverted());
      }}
    />
  );
}

export default YearlyProjectedExpensesFormContainer;

import {
  buildingsOperationsExpensesCompleted,
  buildingsOperationsExpensesReverted,
} from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import BuildingsOperationsExpensesForm from "./BuildingsOperationsExpensesForm";

function YearlyProjectedExpensesFormContainer() {
  const dispatch = useAppDispatch();

  return (
    <BuildingsOperationsExpensesForm
      initialValues={{
        maintenance: 0,
        taxes: 0,
        other: 0,
      }}
      onSubmit={(formData) => {
        const expenses = (
          [
            { purpose: "maintenance", amount: formData.maintenance ?? 0 },
            { purpose: "taxes", amount: formData.taxes ?? 0 },
            { purpose: "other", amount: formData.other ?? 0 },
          ] as const
        ).filter(({ amount }) => amount > 0);
        dispatch(buildingsOperationsExpensesCompleted(expenses));
      }}
      onBack={() => {
        dispatch(buildingsOperationsExpensesReverted());
      }}
    />
  );
}

export default YearlyProjectedExpensesFormContainer;

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import type { VacantPremisesExpenses } from "@/features/create-site/core/urban-zone/steps/expenses/vacant-premises-expenses/vacantPremisesExpenses.schema";
import { selectVacantPremisesExpensesViewData } from "@/features/create-site/core/urban-zone/steps/expenses/vacant-premises-expenses/vacantPremisesExpenses.selectors";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

import VacantPremisesExpensesForm from "./VacantPremisesExpensesForm";

function VacantPremisesExpensesContainer() {
  const dispatch = useAppDispatch();
  const { initialValues } = useAppSelector(selectVacantPremisesExpensesViewData);

  const onSubmit = (data: VacantPremisesExpenses) => {
    dispatch(
      stepCompletionRequested({
        stepId: "URBAN_ZONE_VACANT_PREMISES_EXPENSES",
        answers: data,
      }),
    );
  };

  return (
    <VacantPremisesExpensesForm
      initialValues={initialValues}
      onSubmit={onSubmit}
      onBack={() => dispatch(previousStepRequested())}
    />
  );
}

export default VacantPremisesExpensesContainer;

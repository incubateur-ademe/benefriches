import { ReinstatementExpense } from "shared";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-project/core/actions/actionsUtils";
import { completeReinstatementExpenses } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { selectPVReinstatementExpensesViewData } from "@/features/create-project/core/renewable-energy/selectors/expenses.selectors";
import ReinstatementsExpensesForm from "@/shared/views/project-form/common/expenses/reinstatement";

function ReinstatementExpensesFormContainer() {
  const dispatch = useAppDispatch();
  const {
    siteSoilsDistribution,
    projectSoilsDistribution,
    decontaminatedSurfaceArea,
    reinstatementExpenses: initialValues,
  } = useAppSelector(selectPVReinstatementExpensesViewData);

  return (
    <ReinstatementsExpensesForm
      preEnteredData={initialValues}
      siteSoilsDistribution={siteSoilsDistribution}
      projectSoilsDistribution={projectSoilsDistribution}
      decontaminatedSurfaceArea={decontaminatedSurfaceArea}
      onBack={() => {
        dispatch(stepReverted());
      }}
      onSubmit={(expenses: ReinstatementExpense[]) => {
        dispatch(completeReinstatementExpenses(expenses));
      }}
    />
  );
}

export default ReinstatementExpensesFormContainer;

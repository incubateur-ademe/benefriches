import { ReinstatementExpense } from "shared";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectPVReinstatementExpensesViewData } from "@/features/create-project/core/renewable-energy/step-handlers/expenses/expenses-reinstatement/expensesReinstatement.selector";
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
        dispatch(navigateToPrevious());
      }}
      onSubmit={(expenses: ReinstatementExpense[]) => {
        dispatch(
          requestStepCompletion({
            stepId: "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT",
            answers: { reinstatementExpenses: expenses },
          }),
        );
      }}
    />
  );
}

export default ReinstatementExpensesFormContainer;

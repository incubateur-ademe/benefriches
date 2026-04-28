import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectPVReinstatementExpensesViewData } from "@/features/create-project/core/renewable-energy/step-handlers/expenses/expenses-reinstatement/expensesReinstatement.selector";
import ReinstatementsExpensesForm from "@/shared/views/project-form/common/expenses/reinstatement/ReinstatementExpensesForm";
import {
  mapFormValuesToReinstatementExpenses,
  mapReinstatementExpensesToFormValues,
} from "@/shared/views/project-form/common/expenses/reinstatement/mappers";

function ReinstatementExpensesFormContainer() {
  const dispatch = useAppDispatch();
  const { decontaminatedSurfaceArea, reinstatementExpenses: initialValues } = useAppSelector(
    selectPVReinstatementExpensesViewData,
  );

  return (
    <ReinstatementsExpensesForm
      onBack={() => {
        dispatch(previousStepRequested());
      }}
      onSubmit={(expenses) => {
        dispatch(
          stepCompletionRequested({
            stepId: "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT",
            answers: { reinstatementExpenses: mapFormValuesToReinstatementExpenses(expenses) },
          }),
        );
      }}
      hasProjectedDecontamination={Boolean(
        decontaminatedSurfaceArea && decontaminatedSurfaceArea > 0,
      )}
      initialValues={
        initialValues ? mapReinstatementExpensesToFormValues(initialValues) : undefined
      }
    />
  );
}

export default ReinstatementExpensesFormContainer;

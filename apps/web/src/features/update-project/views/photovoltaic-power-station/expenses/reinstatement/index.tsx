import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import ReinstatementsExpensesForm from "@/features/create-project/views/project-form/common/expenses/reinstatement/ReinstatementExpensesForm";
import {
  mapFormValuesToReinstatementExpenses,
  mapReinstatementExpensesToFormValues,
} from "@/features/create-project/views/project-form/common/expenses/reinstatement/mappers";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectPVReinstatementExpensesViewData } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";

function ReinstatementExpensesFormContainer() {
  const dispatch = useAppDispatch();
  const { decontaminatedSurfaceArea, reinstatementExpenses: initialValues } = useAppSelector(
    selectPVReinstatementExpensesViewData,
  );

  return (
    <ReinstatementsExpensesForm
      onBack={() => {
        dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested());
      }}
      onSubmit={(expenses) => {
        dispatch(
          updateProjectFormRenewableEnergyActions.stepCompletionRequested({
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

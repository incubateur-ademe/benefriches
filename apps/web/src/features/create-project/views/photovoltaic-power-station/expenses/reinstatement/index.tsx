import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";
import ReinstatementsExpensesForm from "@/features/create-project/views/project-form/common/expenses/reinstatement/ReinstatementExpensesForm";
import {
  mapFormValuesToReinstatementExpenses,
  mapReinstatementExpensesToFormValues,
} from "@/features/create-project/views/project-form/common/expenses/reinstatement/mappers";

function ReinstatementExpensesFormContainer() {
  const { onBack, onRequestStepCompletion, selectPVReinstatementExpensesViewData } =
    useRenewableEnergyForm();
  const { decontaminatedSurfaceArea, reinstatementExpenses: initialValues } = useAppSelector(
    selectPVReinstatementExpensesViewData,
  );

  return (
    <ReinstatementsExpensesForm
      onBack={onBack}
      onSubmit={(expenses) => {
        onRequestStepCompletion({
          stepId: "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT",
          answers: { reinstatementExpenses: mapFormValuesToReinstatementExpenses(expenses) },
        });
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

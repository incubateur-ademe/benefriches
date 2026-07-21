import { useAppSelector } from "@/app/hooks/store.hooks";
import ReinstatementsExpensesForm from "@/features/create-project/views/project-form/common/expenses/reinstatement/ReinstatementExpensesForm";
import {
  mapFormValuesToReinstatementExpenses,
  mapReinstatementExpensesToFormValues,
} from "@/features/create-project/views/project-form/common/expenses/reinstatement/mappers";
import { useProjectForm } from "@/features/create-project/views/project-form/useProjectForm";

function ReinstatementExpensesFormContainer() {
  const { onBack, onRequestStepCompletion, selectReinstatementExpensesViewData } = useProjectForm();
  const { reinstatementExpenses, decontaminatedSurfaceArea } = useAppSelector(
    selectReinstatementExpensesViewData,
  );

  return (
    <ReinstatementsExpensesForm
      onBack={onBack}
      onSubmit={(data) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
          answers: {
            reinstatementExpenses: mapFormValuesToReinstatementExpenses(data),
          },
        });
      }}
      hasProjectedDecontamination={Boolean(
        decontaminatedSurfaceArea && decontaminatedSurfaceArea > 0,
      )}
      initialValues={
        reinstatementExpenses
          ? mapReinstatementExpensesToFormValues(reinstatementExpenses)
          : undefined
      }
    />
  );
}

export default ReinstatementExpensesFormContainer;

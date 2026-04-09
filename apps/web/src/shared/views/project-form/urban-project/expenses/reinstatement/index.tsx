import { useAppSelector } from "@/app/hooks/store.hooks";
import ReinstatementsExpensesForm from "@/shared/views/project-form/common/expenses/reinstatement/ReinstatementExpensesForm";
import {
  mapFormValuesToReinstatementExpenses,
  mapReinstatementExpensesToFormValues,
} from "@/shared/views/project-form/common/expenses/reinstatement/mappers";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

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

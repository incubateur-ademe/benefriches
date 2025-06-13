import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { financialAssistanceRevenuesCompleted } from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { selectUrbanProjectFinancialAssistanceRevenueView } from "@/features/create-project/core/urban-project/selectors/revenues.selectors";
import ProjectFinancialAssistanceRevenueForm from "@/features/create-project/views/common-views/revenues/financial-assistance";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function ProjectFinancialAssistanceRevenueFormContainer() {
  const dispatch = useAppDispatch();
  const { values, isReviewing } = useAppSelector(selectUrbanProjectFinancialAssistanceRevenueView);

  return (
    <ProjectFinancialAssistanceRevenueForm
      submitLabel={isReviewing ? "Valider et retourner au récapitulatif" : undefined}
      initialValues={values}
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
      onSubmit={(revenues) => {
        dispatch(financialAssistanceRevenuesCompleted(revenues));
      }}
    />
  );
}

export default ProjectFinancialAssistanceRevenueFormContainer;

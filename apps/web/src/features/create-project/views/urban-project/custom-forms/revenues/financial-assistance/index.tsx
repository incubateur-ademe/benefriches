import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { financialAssistanceRevenuesCompleted } from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { selectUrbanProjectFinancialAssistanceRevenueInitialValues } from "@/features/create-project/core/urban-project/selectors/revenues.selectors";
import ProjectFinancialAssistanceRevenueForm from "@/features/create-project/views/common-views/revenues/financial-assistance";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function ProjectFinancialAssistanceRevenueFormContainer() {
  const dispatch = useAppDispatch();
  const initialValues = useAppSelector(selectUrbanProjectFinancialAssistanceRevenueInitialValues);

  return (
    <ProjectFinancialAssistanceRevenueForm
      initialValues={initialValues}
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

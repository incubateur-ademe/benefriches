import {
  financialAssistanceRevenuesCompleted,
  financialAssistanceRevenuesReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import ProjectFinancialAssistanceRevenueForm from "@/features/create-project/views/common-views/revenues/financial-assistance";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function ProjectFinancialAssistanceRevenueFormContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectFinancialAssistanceRevenueForm
      onBack={() => {
        dispatch(financialAssistanceRevenuesReverted());
      }}
      onSubmit={(revenues) => {
        dispatch(financialAssistanceRevenuesCompleted(revenues));
      }}
    />
  );
}

export default ProjectFinancialAssistanceRevenueFormContainer;

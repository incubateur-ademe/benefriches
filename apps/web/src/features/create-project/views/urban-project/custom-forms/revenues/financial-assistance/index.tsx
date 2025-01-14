import {
  financialAssistanceRevenuesCompleted,
  financialAssistanceRevenuesReverted,
} from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { selectFinancialAssistanceRevenues } from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import ProjectFinancialAssistanceRevenueForm from "@/features/create-project/views/common-views/revenues/financial-assistance";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

function ProjectFinancialAssistanceRevenueFormContainer() {
  const dispatch = useAppDispatch();
  const preEnteredData = useAppSelector(selectFinancialAssistanceRevenues);

  return (
    <ProjectFinancialAssistanceRevenueForm
      preEnteredData={preEnteredData}
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

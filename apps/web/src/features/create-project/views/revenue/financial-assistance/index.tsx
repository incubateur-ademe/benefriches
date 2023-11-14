import {
  goToStep,
  ProjectCreationStep,
  setFinancialAssistanceRevenue,
} from "../../../application/createProject.reducer";
import ProjectFinancialAssistanceRevenueForm, {
  FormValues,
} from "./ProjectFinancialAssistanceRevenueForm";

import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (revenue: FormValues) => {
      const totalRevenue = Object.values(revenue).reduce(
        (sum, revenue) => sum + (revenue ?? 0),
        0,
      );
      dispatch(setFinancialAssistanceRevenue(totalRevenue));
      dispatch(goToStep(ProjectCreationStep.REVENUE_PROJECTED_YEARLY_REVENUE));
    },
  };
};

function ProjectFinancialAssistanceRevenueFormContainer() {
  const dispatch = useAppDispatch();

  return <ProjectFinancialAssistanceRevenueForm {...mapProps(dispatch)} />;
}

export default ProjectFinancialAssistanceRevenueFormContainer;

import {
  goToStep,
  ProjectCreationStep,
  setFinancialAssistanceRevenue,
} from "../../../application/createProject.reducer";
import ProjectFinancialAssistanceRevenueForm, {
  FormValues,
} from "./ProjectFinancialAssistanceRevenueForm";

import { sumObjectValues } from "@/shared/services/sum/sum";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import { AppDispatch } from "@/store";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (revenue: FormValues) => {
      const totalRevenue = sumObjectValues(revenue);
      dispatch(setFinancialAssistanceRevenue(totalRevenue));
      dispatch(goToStep(ProjectCreationStep.NAMING));
    },
  };
};

function ProjectFinancialAssistanceRevenueFormContainer() {
  const dispatch = useAppDispatch();

  return <ProjectFinancialAssistanceRevenueForm {...mapProps(dispatch)} />;
}

export default ProjectFinancialAssistanceRevenueFormContainer;

import {
  goToStep,
  ProjectCreationStep,
  setReinstatementFinancialAssistanceAmount,
} from "../../../application/createProject.reducer";
import ProjectFinancialAssistanceRevenueForm, {
  FormValues,
} from "./ProjectFinancialAssistanceRevenueForm";

import { AppDispatch } from "@/app/application/store";
import { sumObjectValues } from "@/shared/services/sum/sum";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

const mapProps = (dispatch: AppDispatch) => {
  return {
    onSubmit: (revenue: FormValues) => {
      const totalRevenue = sumObjectValues(revenue);
      dispatch(setReinstatementFinancialAssistanceAmount(totalRevenue));
      dispatch(goToStep(ProjectCreationStep.SCHEDULE_INTRODUCTION));
    },
  };
};

function ProjectFinancialAssistanceRevenueFormContainer() {
  const dispatch = useAppDispatch();

  return <ProjectFinancialAssistanceRevenueForm {...mapProps(dispatch)} />;
}

export default ProjectFinancialAssistanceRevenueFormContainer;

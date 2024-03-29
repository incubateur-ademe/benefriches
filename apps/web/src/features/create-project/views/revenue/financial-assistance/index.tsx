import {
  completeReinstatementFinancialAssistance,
  revertReinstatementFinancialAssistance,
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
      dispatch(completeReinstatementFinancialAssistance(totalRevenue));
    },
    onBack: () => {
      dispatch(revertReinstatementFinancialAssistance());
    },
  };
};

function ProjectFinancialAssistanceRevenueFormContainer() {
  const dispatch = useAppDispatch();

  return <ProjectFinancialAssistanceRevenueForm {...mapProps(dispatch)} />;
}

export default ProjectFinancialAssistanceRevenueFormContainer;

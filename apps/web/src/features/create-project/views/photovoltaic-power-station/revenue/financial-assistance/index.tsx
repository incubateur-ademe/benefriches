import {
  completeFinancialAssistanceRevenues,
  revertFinancialAssistanceRevenues,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import ProjectFinancialAssistanceRevenueForm from "../../../common-views/revenues/financial-assistance";

function ProjectFinancialAssistanceRevenueFormContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectFinancialAssistanceRevenueForm
      onBack={() => {
        dispatch(revertFinancialAssistanceRevenues());
      }}
      onSubmit={(revenues) => {
        dispatch(completeFinancialAssistanceRevenues(revenues));
      }}
    />
  );
}

export default ProjectFinancialAssistanceRevenueFormContainer;

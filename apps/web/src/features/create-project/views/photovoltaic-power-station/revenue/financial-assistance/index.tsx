import { completeFinancialAssistanceRevenues } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { financialAssistanceRevenuesStepReverted } from "@/features/create-project/core/renewable-energy/actions/revert.actions";
import { selectPhotovoltaicPowerStationFinancialAssistanceRevenueInitialValues } from "@/features/create-project/core/renewable-energy/selectors/revenues.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectFinancialAssistanceRevenueForm from "../../../common-views/revenues/financial-assistance";

function ProjectFinancialAssistanceRevenueFormContainer() {
  const dispatch = useAppDispatch();
  const initialValues = useAppSelector(
    selectPhotovoltaicPowerStationFinancialAssistanceRevenueInitialValues,
  );

  return (
    <ProjectFinancialAssistanceRevenueForm
      initialValues={initialValues}
      onBack={() => {
        dispatch(financialAssistanceRevenuesStepReverted());
      }}
      onSubmit={(revenues) => {
        dispatch(completeFinancialAssistanceRevenues(revenues));
      }}
    />
  );
}

export default ProjectFinancialAssistanceRevenueFormContainer;

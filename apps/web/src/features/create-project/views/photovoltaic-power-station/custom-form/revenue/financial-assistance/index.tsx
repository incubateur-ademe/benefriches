import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { completeFinancialAssistanceRevenues } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { selectPhotovoltaicPowerStationFinancialAssistanceRevenueInitialValues } from "@/features/create-project/core/renewable-energy/selectors/revenues.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import ProjectFinancialAssistanceRevenueForm from "@/shared/views/project-form/common/revenues/financial-assistance";

function ProjectFinancialAssistanceRevenueFormContainer() {
  const dispatch = useAppDispatch();
  const initialValues = useAppSelector(
    selectPhotovoltaicPowerStationFinancialAssistanceRevenueInitialValues,
  );

  return (
    <ProjectFinancialAssistanceRevenueForm
      initialValues={initialValues}
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
      onSubmit={(revenues) => {
        dispatch(completeFinancialAssistanceRevenues(revenues));
      }}
    />
  );
}

export default ProjectFinancialAssistanceRevenueFormContainer;

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectPhotovoltaicPowerStationFinancialAssistanceRevenueInitialValues } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";
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
        dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested());
      }}
      onSubmit={(revenues) => {
        dispatch(
          updateProjectFormRenewableEnergyActions.stepCompletionRequested({
            stepId: "RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE",
            answers: { financialAssistanceRevenues: revenues },
          }),
        );
      }}
    />
  );
}

export default ProjectFinancialAssistanceRevenueFormContainer;

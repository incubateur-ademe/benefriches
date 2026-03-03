import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectPhotovoltaicPowerStationFinancialAssistanceRevenueInitialValues } from "@/features/create-project/core/renewable-energy/step-handlers/revenue/revenue-financial-assistance/revenueFinancialAssistance.selector";
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
        dispatch(navigateToPrevious());
      }}
      onSubmit={(revenues) => {
        dispatch(
          requestStepCompletion({
            stepId: "RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE",
            answers: { financialAssistanceRevenues: revenues },
          }),
        );
      }}
    />
  );
}

export default ProjectFinancialAssistanceRevenueFormContainer;

import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";
import ProjectFinancialAssistanceRevenueForm from "@/features/create-project/views/project-form/common/revenues/financial-assistance";

function ProjectFinancialAssistanceRevenueFormContainer() {
  const {
    onBack,
    onRequestStepCompletion,
    selectPhotovoltaicPowerStationFinancialAssistanceRevenueInitialValues,
  } = useRenewableEnergyForm();
  const initialValues = useAppSelector(
    selectPhotovoltaicPowerStationFinancialAssistanceRevenueInitialValues,
  );

  return (
    <ProjectFinancialAssistanceRevenueForm
      initialValues={initialValues}
      onBack={onBack}
      onSubmit={(revenues) => {
        onRequestStepCompletion({
          stepId: "RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE",
          answers: { financialAssistanceRevenues: revenues },
        });
      }}
    />
  );
}

export default ProjectFinancialAssistanceRevenueFormContainer;

import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import ProjectFinancialAssistanceRevenueForm from "@/shared/views/project-form/common/revenues/financial-assistance";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

function ProjectFinancialAssistanceRevenueFormContainer() {
  const { onBack, onRequestStepCompletion, selectStepAnswers } = useProjectForm();
  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE"),
  );

  return (
    <ProjectFinancialAssistanceRevenueForm
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE",
          answers: {
            financialAssistanceRevenues: formData,
          },
        });
      }}
      onBack={onBack}
      initialValues={{
        publicSubsidies:
          stepAnswers?.financialAssistanceRevenues?.find(
            ({ source }) => source === "public_subsidies",
          )?.amount ?? 0,
        localOrRegionalAuthority:
          stepAnswers?.financialAssistanceRevenues?.find(
            ({ source }) => source === "local_or_regional_authority_participation",
          )?.amount ?? 0,
        other:
          stepAnswers?.financialAssistanceRevenues?.find(({ source }) => source === "other")
            ?.amount ?? 0,
      }}
    />
  );
}

export default ProjectFinancialAssistanceRevenueFormContainer;

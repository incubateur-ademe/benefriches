import { requestStepCompletion } from "@/features/create-project/core/urban-project-beta/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project-beta/urbanProject.selectors";
import ProjectFinancialAssistanceRevenueForm from "@/features/create-project/views/common-views/revenues/financial-assistance";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useStepBack } from "../../useStepBack";

function ProjectFinancialAssistanceRevenueFormContainer() {
  const dispatch = useAppDispatch();
  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE"),
  );

  const onBack = useStepBack();
  return (
    <ProjectFinancialAssistanceRevenueForm
      onSubmit={(formData) => {
        dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE",
            answers: {
              financialAssistanceRevenues: formData,
            },
          }),
        );
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

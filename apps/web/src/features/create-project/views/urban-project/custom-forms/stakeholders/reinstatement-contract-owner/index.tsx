import StakeholderForm from "@/features/create-project/views/common-views/stakeholder-form";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

function SiteReinstatementContractOwnerFormContainer() {
  const {
    onBack,
    onRequestStepCompletion,
    selectStepAnswers,
    selectUrbanProjectAvailableStakeholders,
    selectUrbanProjectAvailableLocalAuthoritiesStakeholders,
  } = useProjectForm();
  const availableStakeholdersList = useAppSelector(selectUrbanProjectAvailableStakeholders);
  const availableLocalAuthoritiesStakeholders = useAppSelector(
    selectUrbanProjectAvailableLocalAuthoritiesStakeholders,
  );

  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER"),
  );

  return (
    <StakeholderForm
      title="Qui sera le maître d'ouvrage des travaux de remise en état de la friche ?"
      instructions={
        <FormInfo>
          <p>
            Les travaux de remise en état incluent la désimperméabilisation des sols, la
            dépollution, l'enlèvement des déchets, la déconstruction, etc.
          </p>
        </FormInfo>
      }
      initialValues={stepAnswers?.reinstatementContractOwner}
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
          answers: { reinstatementContractOwner: formData },
        });
      }}
      onBack={onBack}
      availableStakeholdersList={availableStakeholdersList}
      availableLocalAuthoritiesStakeholders={availableLocalAuthoritiesStakeholders}
    />
  );
}

export default SiteReinstatementContractOwnerFormContainer;

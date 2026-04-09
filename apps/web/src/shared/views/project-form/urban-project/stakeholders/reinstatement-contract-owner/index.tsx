import { useAppSelector } from "@/app/hooks/store.hooks";
import StakeholderForm from "@/shared/views/project-form/common/stakeholder-form";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

function SiteReinstatementContractOwnerFormContainer() {
  const { onBack, onRequestStepCompletion, selectReinstatementContractOwnerViewData } =
    useProjectForm();
  const {
    availableStakeholdersList,
    availableLocalAuthoritiesStakeholders,
    reinstatementContractOwner,
  } = useAppSelector(selectReinstatementContractOwnerViewData);

  return (
    <StakeholderForm
      title="Qui sera le maître d'ouvrage des travaux de remise en état de la friche&nbsp;?"
      initialValues={reinstatementContractOwner}
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

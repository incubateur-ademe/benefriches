import { useAppSelector } from "@/app/hooks/store.hooks";
import { ProjectStakeholderStructure } from "@/features/create-project/core/project.types";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";
import StakeholderForm from "@/features/create-project/views/project-form/common/stakeholder-form";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";

function DeveloperFormContainer() {
  const { onBack, onRequestStepCompletion, selectPVDeveloperViewData } = useRenewableEnergyForm();
  const { availableStakeholdersList, availableLocalAuthoritiesStakeholders } =
    useAppSelector(selectPVDeveloperViewData);

  const onSubmit = (data: { structureType: ProjectStakeholderStructure; name: string }) => {
    onRequestStepCompletion({
      stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER",
      answers: { projectDeveloper: data },
    });
  };

  return (
    <StakeholderForm
      title="Qui sera l'aménageur du site ?"
      instructions={
        <FormInfo>
          <p>
            L’aménageur est l’acteur qui va engager la reconversion du site. Le bilan économique de
            l’opération sera donc à sa charge.
          </p>
          <p>
            L’aménageur peut aussi être l’exploitant du site ; la question sera posée dans l’étape
            suivante.
          </p>
        </FormInfo>
      }
      onSubmit={onSubmit}
      onBack={onBack}
      availableStakeholdersList={availableStakeholdersList}
      availableLocalAuthoritiesStakeholders={availableLocalAuthoritiesStakeholders}
    />
  );
}

export default DeveloperFormContainer;

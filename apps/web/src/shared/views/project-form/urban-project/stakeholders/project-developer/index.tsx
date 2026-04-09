import { useAppSelector } from "@/app/hooks/store.hooks";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import StakeholderForm from "@/shared/views/project-form/common/stakeholder-form";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

function DeveloperFormContainer() {
  const { onBack, onRequestStepCompletion, selectProjectDeveloperViewData } = useProjectForm();
  const { availableStakeholdersList, availableLocalAuthoritiesStakeholders, projectDeveloper } =
    useAppSelector(selectProjectDeveloperViewData);

  return (
    <StakeholderForm
      title="Qui sera l'aménageur du site ?"
      instructions={
        <FormInfo>
          Aménageur, kézaco ?
          <p>
            L’aménageur est le porteur du projet, celui qui va engager la reconversion du site. Le
            bilan économique de l’opération sera donc à sa charge.
          </p>
        </FormInfo>
      }
      initialValues={projectDeveloper}
      availableStakeholdersList={availableStakeholdersList}
      availableLocalAuthoritiesStakeholders={availableLocalAuthoritiesStakeholders}
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
          answers: { projectDeveloper: formData },
        });
      }}
      onBack={onBack}
    />
  );
}

export default DeveloperFormContainer;

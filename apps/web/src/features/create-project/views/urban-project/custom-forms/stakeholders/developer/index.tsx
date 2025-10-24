import StakeholderForm from "@/features/create-project/views/common-views/stakeholder-form";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import FormInfo from "@/shared/views/layout/WizardFormLayout/FormInfo";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

function DeveloperFormContainer() {
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

  const projectDeveloper = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER"),
  )?.projectDeveloper;

  return (
    <StakeholderForm
      title="Qui sera l'aménageur du site ?"
      instructions={
        <FormInfo>
          <p>
            L’aménageur est l’acteur qui va engager la reconversion du site. Le bilan économique de
            l’opération sera donc à sa charge.
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

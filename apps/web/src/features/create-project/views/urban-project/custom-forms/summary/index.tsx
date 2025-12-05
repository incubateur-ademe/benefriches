import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { StepGroupId } from "@/shared/views/project-form/stepper/stepperConfig";
import ProjectCreationDataSummary from "@/shared/views/project-form/urban-project/summary/ProjectCreationDataSummary";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

function ProjectionCreationDataSummaryContainer() {
  const {
    onBack,
    onNavigateToStepperGroup,
    onSave,
    onNext,
    selectProjectSummary,
    selectIsFormStatusValid,
  } = useProjectForm();

  const isFormValid = useAppSelector(selectIsFormStatusValid);
  const { projectData, projectSoilsDistribution } = useAppSelector(selectProjectSummary);

  return (
    <ProjectCreationDataSummary
      nextDisabled={!isFormValid}
      instructions={!isFormValid ? null : undefined}
      warnings={
        !isFormValid ? (
          <>
            <p>
              <strong>Le formulaire n'est pas complet ! </strong>
            </p>
            <p>
              Pour valider votre projet, veuillez remplir les étapes manquantes en naviguant via
              l'étapier.
            </p>
          </>
        ) : null
      }
      onNext={() => {
        onSave();
        onNext();
      }}
      onBack={onBack}
      projectData={projectData}
      projectSoilsDistribution={projectSoilsDistribution}
      getSectionButtonProps={(stepGroupId: StepGroupId) => {
        return {
          iconId: "fr-icon-pencil-line",
          children: "Modifier",
          onClick: () => {
            onNavigateToStepperGroup(stepGroupId);
          },
        };
      }}
    />
  );
}

export default ProjectionCreationDataSummaryContainer;

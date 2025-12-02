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
      instructions={
        !isFormValid ? (
          <>
            <div className="text-3xl py-2">⚠️</div>
            <strong className="*:mb-4">
              Le formulaire n'est pas complet ! <br />
              Pour valider votre projet, veuillez remplir les étapes manquantes en naviguant via
              l'étapier.
            </strong>
          </>
        ) : undefined
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

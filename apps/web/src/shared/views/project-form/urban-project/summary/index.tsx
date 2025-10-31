import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import { StepGroupId } from "../../stepper/stepperConfig";
import ProjectCreationDataSummary from "./ProjectCreationDataSummary";

function ProjectionCreationDataSummaryContainer() {
  const {
    onBack,
    onNavigateToStepperGroup,
    onSave,
    selectProjectSummary,
    selectIsFormStatusValid,
  } = useProjectForm();

  const isFormValid = useAppSelector(selectIsFormStatusValid);
  const { projectData, projectSoilsDistribution, projectSpaces } =
    useAppSelector(selectProjectSummary);

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
      onNext={onSave}
      onBack={onBack}
      projectData={projectData}
      projectSoilsDistribution={projectSoilsDistribution}
      projectSpaces={projectSpaces}
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

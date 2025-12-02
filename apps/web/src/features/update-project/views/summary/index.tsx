import Button from "@codegouvfr/react-dsfr/Button";

import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { StepGroupId } from "@/shared/views/project-form/stepper/stepperConfig";
import ProjectCreationDataSummary from "@/shared/views/project-form/urban-project/summary/ProjectCreationDataSummary";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

function ProjectionCreationDataSummaryContainer() {
  const {
    onBack,
    onNavigateToStepperGroup,
    onSave,
    selectProjectSummary,
    selectIsFormStatusValid,
    selectSaveState,
  } = useProjectForm();

  const isFormValid = useAppSelector(selectIsFormStatusValid);
  const saveState = useAppSelector(selectSaveState);

  const { projectData, projectSoilsDistribution } = useAppSelector(selectProjectSummary);

  return (
    <ProjectCreationDataSummary
      nextDisabled={!isFormValid || saveState === "success"}
      title={
        <div className="flex justify-between items-start">
          Récapitulatif du projet
          {saveState !== "success" && (
            <Button
              iconId="fr-icon-save-fill"
              onClick={onSave}
              nativeButtonProps={{ disabled: !isFormValid }}
            >
              Sauvegarder les changements
            </Button>
          )}
        </div>
      }
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
        ) : null
      }
      onNext={onSave}
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

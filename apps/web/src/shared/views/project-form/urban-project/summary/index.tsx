import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import UrbanProjectFormSummary from "@/shared/views/project-form/urban-project/summary/UrbanProjectFormSummary";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

function ProjectionCreationDataSummaryContainer() {
  const {
    onBack,
    onSave,
    selectIsFormStatusValid,
    selectSaveState,
    onNavigateToStep,
    selectStepsGroupedBySections,
    selectProjectSummary,
    selectProjectSoilsDistribution,
  } = useProjectForm();

  const isFormValid = useAppSelector(selectIsFormStatusValid);
  const projectSummary = useAppSelector(selectProjectSummary);
  const projectSoilsDistribution = useAppSelector(selectProjectSoilsDistribution);
  const saveState = useAppSelector(selectSaveState);

  const stepsGroupedBySections = useAppSelector(selectStepsGroupedBySections);

  const warnings = isFormValid ? null : (
    <>
      <p>
        <strong>Le formulaire n'est pas complet ! </strong>
      </p>
      <p>
        Pour valider votre projet, veuillez remplir les étapes manquantes en naviguant via
        l'étapier.
      </p>
    </>
  );

  const errors =
    saveState === "error" ? (
      <>
        <p>
          <strong>Une erreur s'est produite lors de la sauvegarde ! </strong>
        </p>
        <p>Veuillez réessayer.</p>
      </>
    ) : null;

  return (
    <UrbanProjectFormSummary
      isDisabled={!isFormValid || saveState === "success"}
      instructions={null}
      warnings={warnings}
      errors={errors}
      onNext={onSave}
      onBack={onBack}
      projectSummary={projectSummary}
      projectSoilsDistribution={projectSoilsDistribution}
      onNavigateToStep={onNavigateToStep}
      stepsGroupedBySections={stepsGroupedBySections}
    />
  );
}

export default ProjectionCreationDataSummaryContainer;

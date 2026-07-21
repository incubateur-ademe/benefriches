import { useAppSelector } from "@/app/hooks/store.hooks";
import { useProjectForm } from "@/features/create-project/views/project-form/useProjectForm";
import UrbanProjectFormSummary from "@/features/create-project/views/urban-project/summary/UrbanProjectFormSummary";

function ProjectionCreationDataSummaryContainer() {
  const { onBack, onSave, onNavigateToStep, selectUrbanProjectSummaryViewData } = useProjectForm();
  const {
    isFormValid,
    projectSummary,
    projectSoilsDistribution,
    saveState,
    stepsGroupedBySections,
  } = useAppSelector(selectUrbanProjectSummaryViewData);

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

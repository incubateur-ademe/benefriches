import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import SoilsDecontaminationSelection from "@/shared/views/project-form/common/soils-decontamination/selection/SoilsDecontaminationSelection";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

function SoilsDecontaminationSelectionContainer() {
  const { onBack, onRequestStepCompletion, selectStepAnswers } = useProjectForm();
  const decontaminationPlan = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION"),
  )?.decontaminationPlan;

  return (
    <SoilsDecontaminationSelection
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
          answers: {
            decontaminationPlan: formData.decontaminationSelection ?? "unknown",
          },
        });
      }}
      onBack={onBack}
      initialValues={{
        decontaminationSelection: decontaminationPlan ?? null,
      }}
    />
  );
}

export default SoilsDecontaminationSelectionContainer;

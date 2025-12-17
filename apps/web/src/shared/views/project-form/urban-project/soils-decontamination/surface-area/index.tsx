import { useSurfaceAreaInputMode } from "@/features/create-project/views/useSurfaceAreaInputMode";
import { computePercentage } from "@/shared/core/percentage/percentage";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import SoilsDecontaminationSurfaceArea from "@/shared/views/project-form/common/soils-decontamination/surface-area/SoilsDecontaminationSurfaceArea";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

function SoilsDecontaminationSurfaceAreaContainer() {
  const { inputMode, onInputModeChange } = useSurfaceAreaInputMode();
  const { onBack, onRequestStepCompletion, selectStepAnswers, selectSiteContaminatedSurfaceArea } =
    useProjectForm();
  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA"),
  );
  const siteContaminatedSurfaceArea = useAppSelector(selectSiteContaminatedSurfaceArea);

  const getInitialValues = () => {
    if (!stepAnswers?.decontaminatedSurfaceArea) {
      return undefined;
    }
    return {
      surfaceArea:
        inputMode === "percentage"
          ? computePercentage(stepAnswers.decontaminatedSurfaceArea, siteContaminatedSurfaceArea)
          : stepAnswers.decontaminatedSurfaceArea,
    };
  };

  return (
    <SoilsDecontaminationSurfaceArea
      contaminatedSoilSurface={siteContaminatedSurfaceArea}
      inputMode={inputMode}
      onInputModeChange={onInputModeChange}
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
          answers: { decontaminatedSurfaceArea: formData },
        });
      }}
      onBack={onBack}
      initialValues={getInitialValues()}
    />
  );
}

export default SoilsDecontaminationSurfaceAreaContainer;

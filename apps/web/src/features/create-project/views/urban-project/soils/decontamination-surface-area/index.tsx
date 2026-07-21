import { useAppSelector } from "@/app/hooks/store.hooks";
import SoilsDecontaminationSurfaceArea from "@/features/create-project/views/project-form/common/soils-decontamination/surface-area/SoilsDecontaminationSurfaceArea";
import { useProjectForm } from "@/features/create-project/views/project-form/useProjectForm";
import { useSurfaceAreaInputMode } from "@/features/create-project/views/useSurfaceAreaInputMode";
import { computePercentage } from "@/shared/core/percentage/percentage";

function SoilsDecontaminationSurfaceAreaContainer() {
  const { inputMode, onInputModeChange } = useSurfaceAreaInputMode();
  const { onBack, onRequestStepCompletion, selectSoilsDecontaminationSurfaceAreaViewData } =
    useProjectForm();
  const { decontaminatedSurfaceArea, siteContaminatedSurfaceArea } = useAppSelector(
    selectSoilsDecontaminationSurfaceAreaViewData,
  );

  const getInitialValues = () => {
    if (!decontaminatedSurfaceArea) {
      return undefined;
    }
    return {
      surfaceArea:
        inputMode === "percentage"
          ? computePercentage(decontaminatedSurfaceArea, siteContaminatedSurfaceArea)
          : decontaminatedSurfaceArea,
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

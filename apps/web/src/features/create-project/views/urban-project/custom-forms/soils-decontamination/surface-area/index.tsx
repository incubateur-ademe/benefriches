import SoilsDecontaminationSurfaceArea from "@/features/create-project/views/common-views/soils-decontamination/surface-area/SoilsDecontaminationSurfaceArea";
import { computePercentage } from "@/shared/core/percentage/percentage";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

function SoilsDecontaminationSurfaceAreaContainer() {
  const { onBack, onRequestStepCompletion, selectStepAnswers, selectSiteContaminatedSurfaceArea } =
    useProjectForm();
  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA"),
  );
  const siteContaminatedSurfaceArea = useAppSelector(selectSiteContaminatedSurfaceArea);

  return (
    <SoilsDecontaminationSurfaceArea
      contaminatedSoilSurface={siteContaminatedSurfaceArea}
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
          answers: { decontaminatedSurfaceArea: formData },
        });
      }}
      onBack={onBack}
      initialValues={
        stepAnswers?.decontaminatedSurfaceArea
          ? {
              percentSurfaceArea: computePercentage(
                stepAnswers.decontaminatedSurfaceArea,
                siteContaminatedSurfaceArea,
              ),
            }
          : undefined
      }
    />
  );
}

export default SoilsDecontaminationSurfaceAreaContainer;

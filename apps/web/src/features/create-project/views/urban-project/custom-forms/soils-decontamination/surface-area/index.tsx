import { selectSiteContaminatedSurfaceArea } from "@/features/create-project/core/createProject.selectors";
import { requestStepCompletion } from "@/features/create-project/core/urban-project/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import SoilsDecontaminationSurfaceArea from "@/features/create-project/views/common-views/soils-decontamination/surface-area/SoilsDecontaminationSurfaceArea";
import { computePercentage } from "@/shared/core/percentage/percentage";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useStepBack } from "../../useStepBack";

function SoilsDecontaminationSurfaceAreaContainer() {
  const dispatch = useAppDispatch();
  const stepAnswers = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA"),
  );
  const siteContaminatedSurfaceArea = useAppSelector(selectSiteContaminatedSurfaceArea);

  const onBack = useStepBack();
  return (
    <SoilsDecontaminationSurfaceArea
      contaminatedSoilSurface={siteContaminatedSurfaceArea}
      onSubmit={(formData) => {
        dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
            answers: { decontaminatedSurfaceArea: formData },
          }),
        );
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

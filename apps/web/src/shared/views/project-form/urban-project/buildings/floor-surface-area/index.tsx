import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import BuildingsFloorSurfaceArea from "./BuildingsFloorSurfaceArea";

export default function BuildingsFloorSurfaceAreaContainer() {
  const { selectStepAnswers, onBack, onRequestStepCompletion } = useProjectForm();

  const buildingsFloorSurfaceArea = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA"),
  )?.buildingsFloorSurfaceArea;

  const livingAndActivitySpacesDistribution = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION"),
  )?.livingAndActivitySpacesDistribution;

  return (
    <BuildingsFloorSurfaceArea
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA",
          answers: { buildingsFloorSurfaceArea: formData.surfaceArea },
        });
      }}
      onBack={onBack}
      buildingsFootprintSurfaceArea={livingAndActivitySpacesDistribution?.BUILDINGS ?? 0}
      initialValues={
        buildingsFloorSurfaceArea ? { surfaceArea: buildingsFloorSurfaceArea } : undefined
      }
    />
  );
}

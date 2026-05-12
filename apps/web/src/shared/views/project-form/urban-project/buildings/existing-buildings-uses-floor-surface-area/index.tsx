import { useAppSelector } from "@/app/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import ExistingBuildingsUsesFloorSurfaceArea from "./ExistingBuildingsUsesFloorSurfaceArea";

export default function ExistingBuildingsUsesFloorSurfaceAreaContainer() {
  const { onBack, onRequestStepCompletion, selectExistingBuildingsUsesFloorSurfaceAreaViewData } =
    useProjectForm();

  const { existingBuildingsUsesFloorSurfaceArea, selectedUses, usesFloorSurfaceAreaDistribution } =
    useAppSelector(selectExistingBuildingsUsesFloorSurfaceAreaViewData);

  return (
    <ExistingBuildingsUsesFloorSurfaceArea
      initialValues={existingBuildingsUsesFloorSurfaceArea}
      selectedUses={selectedUses}
      usesFloorSurfaceAreaDistribution={usesFloorSurfaceAreaDistribution}
      onBack={onBack}
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA",
          answers: { existingBuildingsUsesFloorSurfaceArea: formData },
        });
      }}
    />
  );
}

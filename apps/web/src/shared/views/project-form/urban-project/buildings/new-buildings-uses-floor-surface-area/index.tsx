import { useAppSelector } from "@/app/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import BuildingsNewBuildingsUsesFloorSurfaceArea from "./BuildingsNewBuildingsUsesFloorSurfaceArea";

export default function BuildingsNewBuildingsUsesFloorSurfaceAreaContainer() {
  const { onBack, onRequestStepCompletion, selectNewBuildingsUsesFloorSurfaceAreaViewData } =
    useProjectForm();

  const {
    newBuildingsUsesFloorSurfaceArea,
    selectedUses,
    usesFloorSurfaceAreaDistribution,
    remainingUsesFloorSurfaceAreaDistribution,
  } = useAppSelector(selectNewBuildingsUsesFloorSurfaceAreaViewData);

  return (
    <BuildingsNewBuildingsUsesFloorSurfaceArea
      initialValues={newBuildingsUsesFloorSurfaceArea}
      selectedUses={selectedUses}
      usesFloorSurfaceAreaDistribution={usesFloorSurfaceAreaDistribution}
      remainingUsesFloorSurfaceAreaDistribution={remainingUsesFloorSurfaceAreaDistribution}
      onBack={onBack}
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA",
          answers: { newBuildingsUsesFloorSurfaceArea: formData },
        });
      }}
    />
  );
}

import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import UsesFloorSurfaceArea from "./UsesFloorSurfaceArea";

export default function UsesFloorSurfaceAreaContainer() {
  const { onBack, onRequestStepCompletion, selectUsesFloorSurfaceAreaViewData } = useProjectForm();

  const { usesFloorSurfaceAreaDistribution, selectedUses } = useAppSelector(
    selectUsesFloorSurfaceAreaViewData,
  );

  return (
    <UsesFloorSurfaceArea
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA",
          answers: { usesFloorSurfaceAreaDistribution: formData },
        });
      }}
      onBack={onBack}
      initialValues={usesFloorSurfaceAreaDistribution ?? {}}
      selectedUses={selectedUses}
    />
  );
}

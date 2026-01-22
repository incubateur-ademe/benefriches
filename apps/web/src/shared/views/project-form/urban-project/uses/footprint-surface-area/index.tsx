import { useSurfaceAreaInputMode } from "@/features/create-project/views/useSurfaceAreaInputMode";
import { getSurfaceAreaDistributionWithUnit } from "@/shared/core/reducers/project-form/urban-project/helpers/surfaceAreaDistribution";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import UsesFootprintSurfaceArea from "./UsesFootprintSurfaceArea";

export default function UsesFootprintSurfaceAreaContainer() {
  const { onBack, onRequestStepCompletion, selectUsesFootprintSurfaceAreaViewData } =
    useProjectForm();

  const { usesFootprintSurfaceAreaDistribution, selectedUses, siteSurfaceArea } = useAppSelector(
    selectUsesFootprintSurfaceAreaViewData,
  );

  const { inputMode } = useSurfaceAreaInputMode();

  const initialValues =
    usesFootprintSurfaceAreaDistribution && inputMode === "percentage"
      ? getSurfaceAreaDistributionWithUnit(usesFootprintSurfaceAreaDistribution, "percentage").value
      : (usesFootprintSurfaceAreaDistribution ?? {});

  return (
    <UsesFootprintSurfaceArea
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA",
          answers: { usesFootprintSurfaceAreaDistribution: formData },
        });
      }}
      onBack={onBack}
      initialValues={initialValues}
      totalSurfaceArea={siteSurfaceArea}
      selectedUses={selectedUses}
    />
  );
}

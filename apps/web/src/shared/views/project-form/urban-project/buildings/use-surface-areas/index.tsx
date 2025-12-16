import { typedObjectKeys } from "shared";

import { useSurfaceAreaInputMode } from "@/features/create-project/views/useSurfaceAreaInputMode";
import { getSurfaceAreaDistributionWithUnit } from "@/shared/core/reducers/project-form/urban-project/helpers/surfaceAreaDistribution";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import BuildingsUseSurfaceAreas from "./BuildingsUseSurfaceAreas";

export default function BuildingsUseSurfaceAreaContainers() {
  const { onBack, onRequestStepCompletion, selectStepAnswers } = useProjectForm();

  const buildingsUsesSelection = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_BUILDINGS_USE_SELECTION"),
  )?.buildingsUsesSelection;

  const buildingsFloorSurfaceArea = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA"),
  )?.buildingsFloorSurfaceArea;

  const buildingsUsesDistribution = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION"),
  )?.buildingsUsesDistribution;

  const { inputMode } = useSurfaceAreaInputMode();

  const buildingsUsesOptions = buildingsUsesDistribution
    ? typedObjectKeys(buildingsUsesDistribution)
    : buildingsUsesSelection;

  const initialValues =
    buildingsUsesDistribution && inputMode === "percentage"
      ? getSurfaceAreaDistributionWithUnit(buildingsUsesDistribution, "percentage").value
      : (buildingsUsesDistribution ?? {});

  return (
    <BuildingsUseSurfaceAreas
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
          answers: { buildingsUsesDistribution: formData },
        });
      }}
      onBack={onBack}
      options={buildingsUsesOptions ?? []}
      totalSurfaceArea={buildingsFloorSurfaceArea ?? 0}
      initialValues={initialValues}
    />
  );
}

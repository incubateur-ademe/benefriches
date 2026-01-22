import { useSurfaceAreaInputMode } from "@/features/create-project/views/useSurfaceAreaInputMode";
import { getSurfaceAreaDistributionWithUnit } from "@/shared/core/reducers/project-form/urban-project/helpers/surfaceAreaDistribution";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import SpacesSurfaceAreaForm from "./SpacesSurfaceAreaForm";

export default function SpacesSurfaceAreaContainer() {
  const { onBack, onRequestStepCompletion, selectSpacesSurfaceAreaViewData } = useProjectForm();

  const { spacesSurfaceAreaDistribution, selectedSpaces, siteSurfaceArea, spacesWithConstraints } =
    useAppSelector(selectSpacesSurfaceAreaViewData);

  const { inputMode } = useSurfaceAreaInputMode();

  const initialValues =
    spacesSurfaceAreaDistribution && inputMode === "percentage"
      ? getSurfaceAreaDistributionWithUnit(spacesSurfaceAreaDistribution, "percentage").value
      : (spacesSurfaceAreaDistribution ?? {});

  return (
    <SpacesSurfaceAreaForm
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_SPACES_SURFACE_AREA",
          answers: { spacesSurfaceAreaDistribution: formData },
        });
      }}
      onBack={onBack}
      initialValues={initialValues}
      totalSurfaceArea={siteSurfaceArea}
      selectedSpaces={selectedSpaces}
      spacesWithConstraints={spacesWithConstraints}
    />
  );
}

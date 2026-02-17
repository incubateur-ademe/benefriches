import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import PublicGreenSpacesSurfaceArea from "./PublicGreenSpacesSurfaceArea";

export default function PublicGreenSpacesSurfaceAreaContainer() {
  const { onBack, onRequestStepCompletion, selectPublicGreenSpacesSurfaceAreaViewData } =
    useProjectForm();

  const { publicGreenSpacesSurfaceArea, siteSurfaceArea } = useAppSelector(
    selectPublicGreenSpacesSurfaceAreaViewData,
  );

  return (
    <PublicGreenSpacesSurfaceArea
      onSubmit={(surfaceArea) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA",
          answers: { publicGreenSpacesSurfaceArea: surfaceArea },
        });
      }}
      onBack={onBack}
      initialValue={publicGreenSpacesSurfaceArea}
      siteSurfaceArea={siteSurfaceArea}
    />
  );
}

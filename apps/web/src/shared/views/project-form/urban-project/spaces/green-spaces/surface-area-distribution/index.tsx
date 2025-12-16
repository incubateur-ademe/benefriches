import { useSurfaceAreaInputMode } from "@/features/create-project/views/useSurfaceAreaInputMode";
import { getSurfaceAreaDistributionWithUnit } from "@/shared/core/reducers/project-form/urban-project/helpers/surfaceAreaDistribution";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import UrbanGreenSpacesDistribution from "./UrbanGreenSpacesDistribution";

export default function UrbanGreenSpacesDistributionContainer() {
  const { onBack, onRequestStepCompletion, selectStepAnswers } = useProjectForm();

  const greenSpacesDistribution =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION"))
      ?.greenSpacesDistribution ?? {};
  const spacesCategoriesDistribution =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA"))
      ?.spacesCategoriesDistribution ?? {};

  const { inputMode } = useSurfaceAreaInputMode();

  const initialValues =
    greenSpacesDistribution && inputMode === "percentage"
      ? getSurfaceAreaDistributionWithUnit(greenSpacesDistribution, "percentage").value
      : (greenSpacesDistribution ?? {});

  return (
    <UrbanGreenSpacesDistribution
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
          answers: { greenSpacesDistribution: formData },
        });
      }}
      onBack={onBack}
      totalSurfaceArea={spacesCategoriesDistribution?.GREEN_SPACES ?? 0}
      initialValues={initialValues}
    />
  );
}

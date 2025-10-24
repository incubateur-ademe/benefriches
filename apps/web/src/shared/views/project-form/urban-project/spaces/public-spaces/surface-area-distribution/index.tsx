import { selectAppSettings } from "@/features/app-settings/core/appSettings";
import { getSurfaceAreaDistributionWithUnit } from "@/shared/core/reducers/project-form/urban-project/helpers/surfaceAreaDistribution";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import PublicSpacesDistribution from "./PublicSpacesDistribution";

export default function PublicSpacesDistributionContainer() {
  const { onBack, onRequestStepCompletion, selectStepAnswers } = useProjectForm();

  const publicSpacesDistribution = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION"),
  )?.publicSpacesDistribution;
  const spacesCategoriesDistribution = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA"),
  )?.spacesCategoriesDistribution;
  const inputMode = useAppSelector(selectAppSettings).surfaceAreaInputMode;

  const initialValues =
    publicSpacesDistribution && inputMode === "percentage"
      ? getSurfaceAreaDistributionWithUnit(publicSpacesDistribution, "percentage").value
      : (publicSpacesDistribution ?? {});

  return (
    <PublicSpacesDistribution
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",
          answers: { publicSpacesDistribution: formData },
        });
      }}
      onBack={onBack}
      totalSurfaceArea={spacesCategoriesDistribution?.PUBLIC_SPACES ?? 0}
      initialValues={initialValues}
    />
  );
}

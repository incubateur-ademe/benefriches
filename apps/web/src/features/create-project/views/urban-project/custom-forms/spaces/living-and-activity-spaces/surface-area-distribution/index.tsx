import { selectAppSettings } from "@/features/app-settings/core/appSettings";
import { getSurfaceAreaDistributionWithUnit } from "@/shared/core/reducers/project-form/urban-project/helpers/surfaceAreaDistribution";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import LivingAndActivitySpacesDistribution from "./LivingAndActivitySpacesDistribution";

export default function LivingAndActivitySpacesDistributionContainer() {
  const { onBack, onRequestStepCompletion, selectStepAnswers } = useProjectForm();
  const livingAndActivitySpacesDistribution = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION"),
  )?.livingAndActivitySpacesDistribution;
  const spacesCategoriesDistribution = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA"),
  )?.spacesCategoriesDistribution;
  const inputMode = useAppSelector(selectAppSettings).surfaceAreaInputMode;

  const initialValues =
    livingAndActivitySpacesDistribution && inputMode === "percentage"
      ? getSurfaceAreaDistributionWithUnit(livingAndActivitySpacesDistribution, "percentage").value
      : (livingAndActivitySpacesDistribution ?? {});

  return (
    <LivingAndActivitySpacesDistribution
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
          answers: { livingAndActivitySpacesDistribution: formData },
        });
      }}
      onBack={onBack}
      totalSurfaceArea={spacesCategoriesDistribution?.LIVING_AND_ACTIVITY_SPACES ?? 0}
      initialValues={initialValues}
    />
  );
}

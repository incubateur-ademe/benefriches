import { useSurfaceAreaInputMode } from "@/features/create-project/views/useSurfaceAreaInputMode";
import { getSurfaceAreaDistributionWithUnit } from "@/shared/core/reducers/project-form/urban-project/helpers/surfaceAreaDistribution";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

import UrbanProjectSpaceCategoriesSurfaceAreaDistributionForm from "./SpacesCategoriesSurfaceAreaDistributionForm";

export default function UrbanProjectSpaceCategoriesSurfaceAreaDistributionContainer() {
  const { onBack, onRequestStepCompletion, selectStepAnswers, selectSiteSurfaceArea } =
    useProjectForm();

  const totalSiteSurfaceArea = useAppSelector(selectSiteSurfaceArea);

  const spacesCategoriesDistribution = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA"),
  )?.spacesCategoriesDistribution;

  const spacesCategories = useAppSelector(
    selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SELECTION"),
  )?.spacesCategories;

  const { inputMode } = useSurfaceAreaInputMode();

  const initialValues =
    spacesCategoriesDistribution && inputMode === "percentage"
      ? getSurfaceAreaDistributionWithUnit(spacesCategoriesDistribution, "percentage").value
      : (spacesCategoriesDistribution ?? {});

  return (
    <UrbanProjectSpaceCategoriesSurfaceAreaDistributionForm
      onSubmit={(formData) => {
        onRequestStepCompletion({
          stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
          answers: { spacesCategoriesDistribution: formData },
        });
      }}
      onBack={onBack}
      initialValues={initialValues}
      totalSurfaceArea={totalSiteSurfaceArea}
      spacesCategories={spacesCategories ?? []}
    />
  );
}

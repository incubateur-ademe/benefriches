import { selectAppSettings } from "@/features/app-settings/core/appSettings";
import { selectSiteSurfaceArea } from "@/features/create-project/core/createProject.selectors";
import { requestStepCompletion } from "@/features/create-project/core/urban-project/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import { getSurfaceAreaDistributionWithUnit } from "@/shared/core/reducers/project-form/urban-project/helpers/surfaceAreaDistribution";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useStepBack } from "../../useStepBack";
import UrbanProjectSpaceCategoriesSurfaceAreaDistributionForm from "./SpacesCategoriesSurfaceAreaDistributionForm";

export default function UrbanProjectSpaceCategoriesSurfaceAreaDistributionContainer() {
  const dispatch = useAppDispatch();
  const onBack = useStepBack();

  const totalSiteSurfaceArea = useAppSelector(selectSiteSurfaceArea);

  const { spacesCategoriesDistribution } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA")) ?? {};
  const { spacesCategories } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SELECTION")) ?? {};
  const inputMode = useAppSelector(selectAppSettings).surfaceAreaInputMode;

  const initialValues =
    spacesCategoriesDistribution && inputMode === "percentage"
      ? getSurfaceAreaDistributionWithUnit(spacesCategoriesDistribution, "percentage").value
      : (spacesCategoriesDistribution ?? {});

  return (
    <UrbanProjectSpaceCategoriesSurfaceAreaDistributionForm
      onSubmit={(formData) => {
        dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
            answers: { spacesCategoriesDistribution: formData },
          }),
        );
      }}
      onBack={onBack}
      initialValues={initialValues}
      totalSurfaceArea={totalSiteSurfaceArea}
      spacesCategories={spacesCategories ?? []}
    />
  );
}

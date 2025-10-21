import { selectAppSettings } from "@/features/app-settings/core/appSettings";
import { requestStepCompletion } from "@/features/create-project/core/urban-project/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import { getSurfaceAreaDistributionWithUnit } from "@/shared/core/reducers/project-form/urban-project/helpers/surfaceAreaDistribution";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useStepBack } from "../../../useStepBack";
import PublicSpacesDistribution from "./PublicSpacesDistribution";

export default function PublicSpacesDistributionContainer() {
  const dispatch = useAppDispatch();

  const { publicSpacesDistribution } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION")) ?? {};
  const { spacesCategoriesDistribution } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA")) ?? {};
  const inputMode = useAppSelector(selectAppSettings).surfaceAreaInputMode;

  const initialValues =
    publicSpacesDistribution && inputMode === "percentage"
      ? getSurfaceAreaDistributionWithUnit(publicSpacesDistribution, "percentage").value
      : (publicSpacesDistribution ?? {});

  const onBack = useStepBack();

  return (
    <PublicSpacesDistribution
      onSubmit={(formData) => {
        dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",
            answers: { publicSpacesDistribution: formData },
          }),
        );
      }}
      onBack={onBack}
      totalSurfaceArea={spacesCategoriesDistribution?.PUBLIC_SPACES ?? 0}
      initialValues={initialValues}
    />
  );
}

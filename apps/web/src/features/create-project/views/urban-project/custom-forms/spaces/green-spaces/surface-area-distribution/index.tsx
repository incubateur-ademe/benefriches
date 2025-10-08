import { selectAppSettings } from "@/features/app-settings/core/appSettings";
import { getSurfaceAreaDistributionWithUnit } from "@/features/create-project/core/urban-project/helpers/surfaceAreaDistribution";
import { requestStepCompletion } from "@/features/create-project/core/urban-project/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useStepBack } from "../../../useStepBack";
import UrbanGreenSpacesDistribution from "./UrbanGreenSpacesDistribution";

export default function UrbanGreenSpacesDistributionContainer() {
  const dispatch = useAppDispatch();

  const { greenSpacesDistribution } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION")) ?? {};
  const { spacesCategoriesDistribution } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA")) ?? {};
  const inputMode = useAppSelector(selectAppSettings).surfaceAreaInputMode;

  const initialValues =
    greenSpacesDistribution && inputMode === "percentage"
      ? getSurfaceAreaDistributionWithUnit(greenSpacesDistribution, "percentage").value
      : (greenSpacesDistribution ?? {});

  const onBack = useStepBack();

  return (
    <UrbanGreenSpacesDistribution
      onSubmit={(formData) => {
        dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",
            answers: { greenSpacesDistribution: formData },
          }),
        );
      }}
      onBack={onBack}
      totalSurfaceArea={spacesCategoriesDistribution?.GREEN_SPACES ?? 0}
      initialValues={initialValues}
    />
  );
}

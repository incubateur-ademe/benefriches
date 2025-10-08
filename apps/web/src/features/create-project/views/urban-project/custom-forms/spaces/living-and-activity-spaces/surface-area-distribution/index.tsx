import { selectAppSettings } from "@/features/app-settings/core/appSettings";
import { getSurfaceAreaDistributionWithUnit } from "@/features/create-project/core/urban-project/helpers/surfaceAreaDistribution";
import { requestStepCompletion } from "@/features/create-project/core/urban-project/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useStepBack } from "../../../useStepBack";
import LivingAndActivitySpacesDistribution from "./LivingAndActivitySpacesDistribution";

export default function LivingAndActivitySpacesDistributionContainer() {
  const dispatch = useAppDispatch();
  const { livingAndActivitySpacesDistribution } =
    useAppSelector(
      selectStepAnswers("URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION"),
    ) ?? {};
  const { spacesCategoriesDistribution } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA")) ?? {};
  const inputMode = useAppSelector(selectAppSettings).surfaceAreaInputMode;

  const initialValues =
    livingAndActivitySpacesDistribution && inputMode === "percentage"
      ? getSurfaceAreaDistributionWithUnit(livingAndActivitySpacesDistribution, "percentage").value
      : (livingAndActivitySpacesDistribution ?? {});

  const onBack = useStepBack();

  return (
    <LivingAndActivitySpacesDistribution
      onSubmit={(formData) => {
        dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
            answers: { livingAndActivitySpacesDistribution: formData },
          }),
        );
      }}
      onBack={onBack}
      totalSurfaceArea={spacesCategoriesDistribution?.LIVING_AND_ACTIVITY_SPACES ?? 0}
      initialValues={initialValues}
    />
  );
}

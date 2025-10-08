import { selectAppSettings } from "@/features/app-settings/core/appSettings";
import { getSurfaceAreaDistributionWithUnit } from "@/features/create-project/core/urban-project/helpers/surfaceAreaDistribution";
import { requestStepCompletion } from "@/features/create-project/core/urban-project/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useStepBack } from "../../useStepBack";
import BuildingsUseSurfaceAreas from "./BuildingsUseSurfaceAreas";

export default function BuildingsUseSurfaceAreaContainers() {
  const dispatch = useAppDispatch();

  const { buildingsFloorSurfaceArea } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA")) ?? {};

  const { buildingsUsesDistribution } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION")) ??
    {};
  const inputMode = useAppSelector(selectAppSettings).surfaceAreaInputMode;

  const initialValues =
    buildingsUsesDistribution && inputMode === "percentage"
      ? getSurfaceAreaDistributionWithUnit(buildingsUsesDistribution, "percentage").value
      : (buildingsUsesDistribution ?? {});

  const onBack = useStepBack();

  return (
    <BuildingsUseSurfaceAreas
      onSubmit={(formData) => {
        dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
            answers: { buildingsUsesDistribution: formData },
          }),
        );
      }}
      onBack={onBack}
      totalSurfaceArea={buildingsFloorSurfaceArea ?? 0}
      initialValues={initialValues}
    />
  );
}

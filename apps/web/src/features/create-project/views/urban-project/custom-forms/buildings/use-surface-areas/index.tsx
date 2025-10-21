import { typedObjectKeys } from "shared";

import { selectAppSettings } from "@/features/app-settings/core/appSettings";
import { requestStepCompletion } from "@/features/create-project/core/urban-project/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import { getSurfaceAreaDistributionWithUnit } from "@/shared/core/reducers/project-form/urban-project/helpers/surfaceAreaDistribution";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useStepBack } from "../../useStepBack";
import BuildingsUseSurfaceAreas from "./BuildingsUseSurfaceAreas";

export default function BuildingsUseSurfaceAreaContainers() {
  const dispatch = useAppDispatch();

  const { buildingsUsesSelection } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_BUILDINGS_USE_SELECTION")) ?? {};
  const { buildingsFloorSurfaceArea } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA")) ?? {};

  const { buildingsUsesDistribution } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION")) ??
    {};
  const inputMode = useAppSelector(selectAppSettings).surfaceAreaInputMode;

  const buildingsUsesOptions = buildingsUsesDistribution
    ? typedObjectKeys(buildingsUsesDistribution)
    : buildingsUsesSelection;

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
      options={buildingsUsesOptions ?? []}
      totalSurfaceArea={buildingsFloorSurfaceArea ?? 0}
      initialValues={initialValues}
    />
  );
}

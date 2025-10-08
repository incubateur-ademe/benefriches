import { requestStepCompletion } from "@/features/create-project/core/urban-project-beta/urbanProject.actions";
import { selectStepAnswers } from "@/features/create-project/core/urban-project-beta/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useStepBack } from "../../useStepBack";
import BuildingsFloorSurfaceArea from "./BuildingsFloorSurfaceArea";

export default function BuildingsFloorSurfaceAreaContainer() {
  const dispatch = useAppDispatch();
  const { buildingsFloorSurfaceArea } =
    useAppSelector(selectStepAnswers("URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA")) ?? {};
  const { livingAndActivitySpacesDistribution } =
    useAppSelector(
      selectStepAnswers("URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION"),
    ) ?? {};

  const onBack = useStepBack();

  return (
    <BuildingsFloorSurfaceArea
      onSubmit={(formData) => {
        dispatch(
          requestStepCompletion({
            stepId: "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA",
            answers: { buildingsFloorSurfaceArea: formData.surfaceArea },
          }),
        );
      }}
      onBack={onBack}
      buildingsFootprintSurfaceArea={livingAndActivitySpacesDistribution?.BUILDINGS ?? 0}
      initialValues={
        buildingsFloorSurfaceArea ? { surfaceArea: buildingsFloorSurfaceArea } : undefined
      }
    />
  );
}

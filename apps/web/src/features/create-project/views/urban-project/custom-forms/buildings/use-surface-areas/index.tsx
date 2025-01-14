import { SurfaceAreaDistributionJson } from "shared";

import {
  buildingsUseCategorySurfaceAreasCompleted,
  buildingsUseCategorySurfaceAreasReverted,
} from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import {
  selectBuildingsFloorSurfaceArea,
  selectBuildingsFloorUseSurfaceAreas,
} from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import { BuildingsUseCategory } from "@/features/create-project/core/urban-project/urbanProject";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import BuildingsUseSurfaceAreas from "./BuildingsUseSurfaceAreas";

export default function BuildingsUseSurfaceAreaContainers() {
  const dispatch = useAppDispatch();
  const buildingsFloorSurfaceArea = useAppSelector(selectBuildingsFloorSurfaceArea);
  const initialValues = useAppSelector(selectBuildingsFloorUseSurfaceAreas);

  return (
    <BuildingsUseSurfaceAreas
      initialValues={initialValues.value}
      onSubmit={(data: SurfaceAreaDistributionJson<BuildingsUseCategory>) => {
        dispatch(buildingsUseCategorySurfaceAreasCompleted(data));
      }}
      onBack={() => {
        dispatch(buildingsUseCategorySurfaceAreasReverted());
      }}
      totalSurfaceArea={buildingsFloorSurfaceArea}
    />
  );
}

import { SurfaceAreaDistributionJson } from "shared";

import {
  buildingsUseCategorySurfaceAreasCompleted,
  buildingsUseCategorySurfaceAreasReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { selectBuildingsFloorSurfaceArea } from "@/features/create-project/application/urban-project/urbanProject.selectors";
import { BuildingsUseCategory } from "@/features/create-project/domain/urbanProject";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import BuildingsUseSurfaceAreas from "./BuildingsUseSurfaceAreas";

export default function BuildingsUseSurfaceAreaContainers() {
  const dispatch = useAppDispatch();
  const buildingsFloorSurfaceArea = useAppSelector(selectBuildingsFloorSurfaceArea);

  return (
    <BuildingsUseSurfaceAreas
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

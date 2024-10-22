import { BuildingsUse } from "shared";

import {
  buildingsUseSurfaceAreasCompleted,
  buildingsUseSurfaceAreasReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import {
  selectBuildingsFloorSurfaceArea,
  selectBuildingsUses,
} from "@/features/create-project/application/urban-project/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import BuildingsUseSurfaceAreas from "./BuildingsUseSurfaceAreas";

export default function BuildingsUseSurfaceAreaContainers() {
  const dispatch = useAppDispatch();
  const selectedBuildingsUses = useAppSelector(selectBuildingsUses);
  const buildingsFloorSurfaceArea = useAppSelector(selectBuildingsFloorSurfaceArea);

  return (
    <BuildingsUseSurfaceAreas
      onSubmit={(data: Record<BuildingsUse, number>) => {
        dispatch(buildingsUseSurfaceAreasCompleted(data));
      }}
      onBack={() => {
        dispatch(buildingsUseSurfaceAreasReverted());
      }}
      totalSurfaceArea={buildingsFloorSurfaceArea}
      selectedBuildingsUses={selectedBuildingsUses}
    />
  );
}

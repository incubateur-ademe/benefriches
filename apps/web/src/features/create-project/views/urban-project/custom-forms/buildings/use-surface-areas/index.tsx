import {
  buildingsUseCategorySurfaceAreasCompleted,
  buildingsUseCategorySurfaceAreasReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import {
  selectBuildingsFloorSurfaceArea,
  selectBuildingUseCategories,
} from "@/features/create-project/application/urban-project/urbanProject.selectors";
import { BuildingsUseCategory } from "@/features/create-project/domain/urbanProject";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import BuildingsUseSurfaceAreas from "./BuildingsUseSurfaceAreas";

export default function BuildingsUseSurfaceAreaContainers() {
  const dispatch = useAppDispatch();
  const selectedBuildingsUses = useAppSelector(selectBuildingUseCategories);
  const buildingsFloorSurfaceArea = useAppSelector(selectBuildingsFloorSurfaceArea);

  return (
    <BuildingsUseSurfaceAreas
      onSubmit={(data: Record<BuildingsUseCategory, number>) => {
        dispatch(buildingsUseCategorySurfaceAreasCompleted(data));
      }}
      onBack={() => {
        dispatch(buildingsUseCategorySurfaceAreasReverted());
      }}
      totalSurfaceArea={buildingsFloorSurfaceArea}
      selectedBuildingsUseCategories={selectedBuildingsUses}
    />
  );
}

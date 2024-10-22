import {
  buildingsFloorSurfaceAreaCompleted,
  buildingsFloorSurfaceAreaReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { selectBuildingsFootprintSurfaceArea } from "@/features/create-project/application/urban-project/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import BuildingsFloorSurfaceArea from "./BuildingsFloorSurfaceArea";

export default function BuildingsFloorSurfaceAreaContainer() {
  const dispatch = useAppDispatch();
  const buildingsFootprintSurfaceArea = useAppSelector(selectBuildingsFootprintSurfaceArea);

  return (
    <BuildingsFloorSurfaceArea
      onSubmit={({ surfaceArea }: { surfaceArea: number }) =>
        dispatch(buildingsFloorSurfaceAreaCompleted(surfaceArea))
      }
      onBack={() => dispatch(buildingsFloorSurfaceAreaReverted())}
      buildingsFootprintSurfaceArea={buildingsFootprintSurfaceArea}
    />
  );
}

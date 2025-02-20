import {
  buildingsFloorSurfaceAreaCompleted,
  buildingsFloorSurfaceAreaReverted,
} from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import {
  selectBuildingsFloorSurfaceArea,
  selectBuildingsFootprintSurfaceArea,
} from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import BuildingsFloorSurfaceArea from "./BuildingsFloorSurfaceArea";

export default function BuildingsFloorSurfaceAreaContainer() {
  const dispatch = useAppDispatch();
  const buildingsFootprintSurfaceArea = useAppSelector(selectBuildingsFootprintSurfaceArea);
  const initialValue = useAppSelector(selectBuildingsFloorSurfaceArea);

  return (
    <BuildingsFloorSurfaceArea
      initialValues={initialValue ? { surfaceArea: initialValue } : undefined}
      onSubmit={({ surfaceArea }: { surfaceArea: number }) =>
        dispatch(buildingsFloorSurfaceAreaCompleted(surfaceArea))
      }
      onBack={() => dispatch(buildingsFloorSurfaceAreaReverted())}
      buildingsFootprintSurfaceArea={buildingsFootprintSurfaceArea}
    />
  );
}

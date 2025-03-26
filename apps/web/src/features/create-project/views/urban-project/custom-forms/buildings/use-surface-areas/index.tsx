import { BuildingsUse, SurfaceAreaDistributionJson } from "shared";

import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { buildingsUseSurfaceAreasCompleted } from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import {
  selectBuildingsFloorSurfaceArea,
  selectBuildingsFloorUseSurfaceAreas,
} from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import BuildingsUseSurfaceAreas from "./BuildingsUseSurfaceAreas";

export default function BuildingsUseSurfaceAreaContainers() {
  const dispatch = useAppDispatch();
  const buildingsFloorSurfaceArea = useAppSelector(selectBuildingsFloorSurfaceArea);
  const initialValues = useAppSelector(selectBuildingsFloorUseSurfaceAreas);

  return (
    <BuildingsUseSurfaceAreas
      initialValues={initialValues.value}
      onSubmit={(data: SurfaceAreaDistributionJson<BuildingsUse>) => {
        dispatch(buildingsUseSurfaceAreasCompleted(data));
      }}
      onBack={() => {
        dispatch(stepRevertAttempted());
      }}
      totalSurfaceArea={buildingsFloorSurfaceArea}
    />
  );
}

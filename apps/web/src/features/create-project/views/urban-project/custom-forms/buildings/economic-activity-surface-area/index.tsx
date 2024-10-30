import {
  buildingsEconomicActivitySurfaceAreasCompleted,
  buildingsEconomicActivitySurfaceAreasReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { selectBuildingsEconomicActivityUses } from "@/features/create-project/application/urban-project/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import EconomicActivitiesSurfaceArea, { type FormValues } from "./EconomicActivitySurfaceArea";

function BuildingsEconomicActivitySurfaceAreaContainer() {
  const dispatch = useAppDispatch();
  const { buildingsEconomicActivityTotalSurfaceArea, buildingsEconomicActivityUses } =
    useAppSelector(selectBuildingsEconomicActivityUses);

  const onSubmit = (formData: FormValues) => {
    dispatch(buildingsEconomicActivitySurfaceAreasCompleted(formData));
  };

  const onBack = () => {
    dispatch(buildingsEconomicActivitySurfaceAreasReverted());
  };

  return (
    <EconomicActivitiesSurfaceArea
      onSubmit={onSubmit}
      onBack={onBack}
      soils={buildingsEconomicActivityUses}
      totalSurfaceArea={buildingsEconomicActivityTotalSurfaceArea}
    />
  );
}

export default BuildingsEconomicActivitySurfaceAreaContainer;

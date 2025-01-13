import {
  buildingsEconomicActivitySurfaceAreasCompleted,
  buildingsEconomicActivitySurfaceAreasReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import {
  selectBuildingsEconomicActivitySurfaceDistributionWithUnit,
  selectBuildingsEconomicActivityUses,
} from "@/features/create-project/application/urban-project/urbanProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import EconomicActivitiesSurfaceArea, { type FormValues } from "./EconomicActivitySurfaceArea";

function BuildingsEconomicActivitySurfaceAreaContainer() {
  const dispatch = useAppDispatch();
  const { buildingsEconomicActivityTotalSurfaceArea } = useAppSelector(
    selectBuildingsEconomicActivityUses,
  );
  const initialValues = useAppSelector(selectBuildingsEconomicActivitySurfaceDistributionWithUnit);

  const onSubmit = (formData: FormValues) => {
    dispatch(buildingsEconomicActivitySurfaceAreasCompleted(formData));
  };

  const onBack = () => {
    dispatch(buildingsEconomicActivitySurfaceAreasReverted());
  };

  return (
    <EconomicActivitiesSurfaceArea
      initialValues={initialValues.value}
      onSubmit={onSubmit}
      onBack={onBack}
      totalSurfaceArea={buildingsEconomicActivityTotalSurfaceArea}
    />
  );
}

export default BuildingsEconomicActivitySurfaceAreaContainer;

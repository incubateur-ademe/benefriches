import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { fetchCurrentAndProjectedSoilsCarbonStorage } from "@/features/create-project/core/renewable-energy/actions/soilsCarbonStorage.actions";
import {
  navigateToNext,
  navigateToPrevious,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import SoilsCarbonStorageComparison from "@/shared/views/project-form/common/soils-carbon-storage-comparison";

function ProjectSoilsCarbonStorageContainer() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(
    (state) => state.projectCreation.renewableEnergyProject.soilsCarbonStorage,
  );

  useEffect(() => {
    void dispatch(fetchCurrentAndProjectedSoilsCarbonStorage());
  }, [dispatch]);

  if (state.loadingState === "success") {
    return (
      <SoilsCarbonStorageComparison
        onNext={() => {
          dispatch(navigateToNext());
        }}
        onBack={() => dispatch(navigateToPrevious())}
        loadingState={state.loadingState}
        currentCarbonStorage={state.current}
        projectedCarbonStorage={state.projected}
      />
    );
  }

  return (
    <SoilsCarbonStorageComparison
      onNext={() => {
        dispatch(navigateToNext());
      }}
      onBack={() => dispatch(navigateToPrevious())}
      loadingState={state.loadingState}
      currentCarbonStorage={undefined}
      projectedCarbonStorage={undefined}
    />
  );
}

export default ProjectSoilsCarbonStorageContainer;

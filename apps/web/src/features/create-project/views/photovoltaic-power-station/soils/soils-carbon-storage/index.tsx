import { useEffect } from "react";

import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { completeSoilsCarbonStorageStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { fetchCurrentAndProjectedSoilsCarbonStorage } from "@/features/create-project/core/renewable-energy/actions/soilsCarbonStorage.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SoilsCarbonStorageComparison from "../../../common-views/soils-carbon-storage-comparison";

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
          dispatch(completeSoilsCarbonStorageStep());
        }}
        onBack={() => dispatch(stepRevertAttempted())}
        loadingState={state.loadingState}
        currentCarbonStorage={state.current}
        projectedCarbonStorage={state.projected}
      />
    );
  }

  return (
    <SoilsCarbonStorageComparison
      onNext={() => {
        dispatch(completeSoilsCarbonStorageStep());
      }}
      onBack={() => dispatch(stepRevertAttempted())}
      loadingState={state.loadingState}
      currentCarbonStorage={undefined}
      projectedCarbonStorage={undefined}
    />
  );
}

export default ProjectSoilsCarbonStorageContainer;

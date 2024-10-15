import { useEffect } from "react";

import {
  completeSoilsCarbonStorageStep,
  revertSoilsCarbonStorageStep,
} from "@/features/create-project/application/createProject.reducer";
import { fetchCurrentAndProjectedSoilsCarbonStorage } from "@/features/create-project/application/soilsCarbonStorage.actions";
import { State } from "@/features/create-project/application/soilsCarbonStorage.reducer";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SoilsCarbonStorageComparison from "../../../common-views/soils-carbon-storage-comparison";

function ProjectSoilsCarbonStorageContainer() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.projectSoilsCarbonStorage) as State;

  useEffect(() => {
    void dispatch(fetchCurrentAndProjectedSoilsCarbonStorage());
  }, [dispatch]);

  if (state.loadingState === "success") {
    return (
      <SoilsCarbonStorageComparison
        onNext={() => {
          dispatch(completeSoilsCarbonStorageStep());
        }}
        onBack={() => dispatch(revertSoilsCarbonStorageStep())}
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
      onBack={() => dispatch(revertSoilsCarbonStorageStep())}
      loadingState={state.loadingState}
      currentCarbonStorage={undefined}
      projectedCarbonStorage={undefined}
    />
  );
}

export default ProjectSoilsCarbonStorageContainer;

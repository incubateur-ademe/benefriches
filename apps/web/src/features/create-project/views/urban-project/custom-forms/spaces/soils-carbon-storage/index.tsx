import { useEffect } from "react";

import { SoilsCarbonStorageResult } from "@/features/create-project/application/soilsCarbonStorage.actions";
import { fetchCurrentAndProjectedSoilsCarbonStorage } from "@/features/create-project/application/urban-project/soilsCarbonStorage.actions";
import {
  selectCurrentAndProjectedSoilsCarbonStorage,
  selectLoadingState,
} from "@/features/create-project/application/urban-project/soilsCarbonStorage.selectors";
import {
  soilsCarbonStorageCompleted,
  soilsCarbonStorageReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import SoilsCarbonStorageComparison from "@/features/create-project/views/common-views/soils-carbon-storage-comparison";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

export default function UrbanProjectSoilsCarbonStorageContainer() {
  const dispatch = useAppDispatch();
  const loadingState = useAppSelector(selectLoadingState);
  const { current, projected } = useAppSelector(selectCurrentAndProjectedSoilsCarbonStorage);

  useEffect(() => {
    void dispatch(fetchCurrentAndProjectedSoilsCarbonStorage());
  }, [dispatch]);

  if (loadingState === "success") {
    return (
      <SoilsCarbonStorageComparison
        loadingState={loadingState}
        onNext={() => {
          dispatch(soilsCarbonStorageCompleted());
        }}
        onBack={() => {
          dispatch(soilsCarbonStorageReverted());
        }}
        currentCarbonStorage={current as SoilsCarbonStorageResult}
        projectedCarbonStorage={projected as SoilsCarbonStorageResult}
      />
    );
  }
  return (
    <SoilsCarbonStorageComparison
      loadingState={loadingState}
      currentCarbonStorage={undefined}
      projectedCarbonStorage={undefined}
      onNext={() => {
        dispatch(soilsCarbonStorageCompleted());
      }}
      onBack={() => {
        dispatch(soilsCarbonStorageReverted());
      }}
    />
  );
}

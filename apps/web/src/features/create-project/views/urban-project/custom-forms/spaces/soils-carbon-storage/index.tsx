import { useEffect } from "react";

import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { SoilsCarbonStorageResult } from "@/features/create-project/core/actions/soilsCarbonStorage.action";
import { fetchCurrentAndProjectedSoilsCarbonStorage } from "@/features/create-project/core/urban-project/actions/soilsCarbonStorage.actions";
import { soilsCarbonStorageCompleted } from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import {
  selectCurrentAndProjectedSoilsCarbonStorage,
  selectLoadingState,
} from "@/features/create-project/core/urban-project/selectors/soilsCarbonStorage.selectors";
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
          dispatch(stepRevertAttempted());
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
        dispatch(stepRevertAttempted());
      }}
    />
  );
}

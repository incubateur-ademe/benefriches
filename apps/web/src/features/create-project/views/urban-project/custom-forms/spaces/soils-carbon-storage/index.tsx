import { useEffect } from "react";

import { fetchCurrentAndProjectedSoilsCarbonStorage } from "@/features/create-project/core/urban-project/soils-carbon-storage/soilsCarbonStorage.action";
import {
  selectCurrentAndProjectedSoilsCarbonStorage,
  selectLoadingState,
} from "@/features/create-project/core/urban-project/soils-carbon-storage/soilsCarbonStorage.selectors";
import SoilsCarbonStorageComparison from "@/features/create-project/views/common-views/soils-carbon-storage-comparison/SoilsCarbonStorageComparison";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useInformationalStepBackNext } from "../../useInformationalStepBackNext";

export default function UrbanProjectSoilsCarbonStorageContainer() {
  const dispatch = useAppDispatch();
  const { current, projected } = useAppSelector(selectCurrentAndProjectedSoilsCarbonStorage);
  const { onNext, onBack } = useInformationalStepBackNext();
  const loadingState = useAppSelector(selectLoadingState);

  useEffect(() => {
    void dispatch(fetchCurrentAndProjectedSoilsCarbonStorage());
  }, [dispatch]);

  useEffect(() => {
    if (loadingState === "error") {
      onNext();
    }
  }, [loadingState, onNext]);

  if (loadingState !== "success") {
    return <LoadingSpinner />;
  }

  return (
    <SoilsCarbonStorageComparison
      onNext={onNext}
      onBack={onBack}
      currentCarbonStorage={current!}
      projectedCarbonStorage={projected!}
    />
  );
}

import { useEffect } from "react";

import { fetchSoilsCarbonStorageDifference } from "@/features/create-project/core/urban-project/urbanProject.actions";
import { selectSoilsCarbonStorageDifference } from "@/features/create-project/core/urban-project/urbanProject.selectors";
import SoilsCarbonStorageComparison from "@/features/create-project/views/common-views/soils-carbon-storage-comparison/SoilsCarbonStorageComparison";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { useInformationalStepBackNext } from "../../useInformationalStepBackNext";

export default function UrbanProjectSoilsCarbonStorageContainer() {
  const dispatch = useAppDispatch();
  const { current, projected, loadingState } = useAppSelector(selectSoilsCarbonStorageDifference);
  const { onNext, onBack } = useInformationalStepBackNext();

  useEffect(() => {
    void dispatch(fetchSoilsCarbonStorageDifference());
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

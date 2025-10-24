import { useEffect } from "react";

import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import SoilsCarbonStorageComparison from "@/shared/views/project-form/common/soils-carbon-storage-comparison/SoilsCarbonStorageComparison";
import { useProjectForm } from "@/shared/views/project-form/useProjectForm";

export default function UrbanProjectSoilsCarbonStorageContainer() {
  const dispatch = useAppDispatch();

  const {
    onBack,
    onNext,
    selectSoilsCarbonStorageDifference,
    onFetchSoilsCarbonStorageDifference,
  } = useProjectForm();

  const { current, projected, loadingState } = useAppSelector(selectSoilsCarbonStorageDifference);

  useEffect(() => {
    onFetchSoilsCarbonStorageDifference();
  }, [dispatch, onFetchSoilsCarbonStorageDifference]);

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

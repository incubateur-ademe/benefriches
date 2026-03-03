import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { fetchCurrentAndProjectedSoilsCarbonStorage } from "@/features/create-project/core/renewable-energy/actions/soilsCarbonStorage.actions";
import {
  navigateToNext,
  navigateToPrevious,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectSoilsCarbonStorageViewData } from "@/features/create-project/core/renewable-energy/step-handlers/summary/soilsCarbonStorage.selector";
import SoilsCarbonStorageComparison from "@/shared/views/project-form/common/soils-carbon-storage-comparison";

function ProjectSoilsCarbonStorageContainer() {
  const dispatch = useAppDispatch();
  const viewData = useAppSelector(selectSoilsCarbonStorageViewData);

  useEffect(() => {
    void dispatch(fetchCurrentAndProjectedSoilsCarbonStorage());
  }, [dispatch]);

  if (viewData.loadingState === "success") {
    return (
      <SoilsCarbonStorageComparison
        onNext={() => {
          dispatch(navigateToNext());
        }}
        onBack={() => dispatch(navigateToPrevious())}
        loadingState={viewData.loadingState}
        currentCarbonStorage={viewData.current}
        projectedCarbonStorage={viewData.projected}
      />
    );
  }

  return (
    <SoilsCarbonStorageComparison
      onNext={() => {
        dispatch(navigateToNext());
      }}
      onBack={() => dispatch(navigateToPrevious())}
      loadingState={viewData.loadingState}
      currentCarbonStorage={undefined}
      projectedCarbonStorage={undefined}
    />
  );
}

export default ProjectSoilsCarbonStorageContainer;

import { useEffect } from "react";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";
import SoilsCarbonStorageComparison from "@/features/create-project/views/project-form/common/soils-carbon-storage-comparison";

function ProjectSoilsCarbonStorageContainer() {
  const { onNext, onBack, onFetchSoilsCarbonStorage, selectSoilsCarbonStorageViewData } =
    useRenewableEnergyForm();
  const viewData = useAppSelector(selectSoilsCarbonStorageViewData);

  useEffect(() => {
    onFetchSoilsCarbonStorage();
  }, [onFetchSoilsCarbonStorage]);

  if (viewData.loadingState === "success") {
    return (
      <SoilsCarbonStorageComparison
        onNext={onNext}
        onBack={onBack}
        loadingState={viewData.loadingState}
        currentCarbonStorage={viewData.current}
        projectedCarbonStorage={viewData.projected}
      />
    );
  }

  return (
    <SoilsCarbonStorageComparison
      onNext={onNext}
      onBack={onBack}
      loadingState={viewData.loadingState}
      currentCarbonStorage={undefined}
      projectedCarbonStorage={undefined}
    />
  );
}

export default ProjectSoilsCarbonStorageContainer;

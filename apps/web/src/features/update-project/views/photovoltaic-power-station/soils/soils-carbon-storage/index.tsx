import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { fetchCurrentAndProjectedSoilsCarbonStorageForUpdate } from "@/features/update-project/core/actions/fetchCurrentAndProjectedSoilsCarbonStorage.action";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectSoilsCarbonStorageViewData } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";
import SoilsCarbonStorageComparison from "@/shared/views/project-form/common/soils-carbon-storage-comparison";

function ProjectSoilsCarbonStorageContainer() {
  const dispatch = useAppDispatch();
  const viewData = useAppSelector(selectSoilsCarbonStorageViewData);

  useEffect(() => {
    void dispatch(fetchCurrentAndProjectedSoilsCarbonStorageForUpdate());
  }, [dispatch]);

  if (viewData.loadingState === "success") {
    return (
      <SoilsCarbonStorageComparison
        onNext={() => {
          dispatch(updateProjectFormRenewableEnergyActions.nextStepRequested());
        }}
        onBack={() => dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested())}
        loadingState={viewData.loadingState}
        currentCarbonStorage={viewData.current}
        projectedCarbonStorage={viewData.projected}
      />
    );
  }

  return (
    <SoilsCarbonStorageComparison
      onNext={() => {
        dispatch(updateProjectFormRenewableEnergyActions.nextStepRequested());
      }}
      onBack={() => dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested())}
      loadingState={viewData.loadingState}
      currentCarbonStorage={undefined}
      projectedCarbonStorage={undefined}
    />
  );
}

export default ProjectSoilsCarbonStorageContainer;

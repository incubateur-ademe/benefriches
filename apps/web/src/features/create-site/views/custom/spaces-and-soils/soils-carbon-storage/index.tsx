import { stepReverted } from "@/features/create-site/core/actions/revert.action";
import { fetchSiteSoilsCarbonStorage } from "@/features/create-site/core/actions/siteSoilsCarbonStorage.actions";
import { soilsCarbonStorageStepCompleted } from "@/features/create-site/core/steps/spaces/spaces.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SiteSoilsCarbonStorage from "./SiteSoilsCarbonStorage";

function SiteSoilsCarbonStorageContainer() {
  const dispatch = useAppDispatch();
  const { carbonStorage, loadingState } = useAppSelector((state) => state.siteCarbonStorage);

  return (
    <SiteSoilsCarbonStorage
      onNext={() => {
        dispatch(soilsCarbonStorageStepCompleted());
      }}
      onBack={() => {
        dispatch(stepReverted());
      }}
      fetchSiteCarbonStorage={async () => {
        await dispatch(fetchSiteSoilsCarbonStorage());
      }}
      loading={loadingState === "loading"}
      siteCarbonStorage={carbonStorage}
    />
  );
}

export default SiteSoilsCarbonStorageContainer;

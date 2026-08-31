import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { fetchSiteSoilsCarbonStorage } from "@/features/create-site/core/actions/siteSoilsCarbonStorage.actions";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-site/core/custom/custom.actions";

import SiteSoilsCarbonStorage from "./SiteSoilsCarbonStorage";

function SiteSoilsCarbonStorageContainer() {
  const dispatch = useAppDispatch();
  const { carbonStorage, loadingState } = useAppSelector((state) => state.siteCarbonStorage);

  return (
    <SiteSoilsCarbonStorage
      onNext={() => {
        dispatch(nextStepRequested());
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
      fetchSiteCarbonStorage={async () => {
        await dispatch(fetchSiteSoilsCarbonStorage());
      }}
      loadingState={loadingState}
      siteCarbonStorage={carbonStorage}
    />
  );
}

export default SiteSoilsCarbonStorageContainer;

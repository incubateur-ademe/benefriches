import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { fetchSiteSoilsCarbonStorage } from "@/features/create-site/core/actions/siteSoilsCarbonStorage.actions";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";
import SiteSoilsCarbonStorage from "@/features/create-site/views/common-views/spaces-and-soils/soils-carbon-storage/SiteSoilsCarbonStorage";

function UrbanZoneSoilsCarbonStorageContainer() {
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

export default UrbanZoneSoilsCarbonStorageContainer;

import { fetchSiteSoilsCarbonStorage } from "@/features/create-site/core/actions/siteSoilsCarbonStorage.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { completeSoilsCarbonStorage, revertStep } from "../../../../core/createSite.reducer";
import SiteSoilsCarbonStorage from "./SiteSoilsCarbonStorage";

function SiteSoilsCarbonStorageContainer() {
  const dispatch = useAppDispatch();
  const { carbonStorage, loadingState } = useAppSelector((state) => state.siteCarbonStorage);

  return (
    <SiteSoilsCarbonStorage
      onNext={() => {
        dispatch(completeSoilsCarbonStorage());
      }}
      onBack={() => {
        dispatch(revertStep());
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

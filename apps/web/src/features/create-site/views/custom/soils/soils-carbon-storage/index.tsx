import { AppDispatch, RootState } from "@/app/application/store";
import { fetchSiteSoilsCarbonStorage } from "@/features/create-site/application/siteSoilsCarbonStorage.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { completeSoilsCarbonStorage, revertStep } from "../../../../application/createSite.reducer";
import SiteSoilsCarbonStorage from "./SiteSoilsCarbonStorage";

const mapProps = (dispatch: AppDispatch, siteCarbonStorage: RootState["siteCarbonStorage"]) => {
  const { loadingState, carbonStorage } = siteCarbonStorage;

  return {
    onNext: () => {
      dispatch(completeSoilsCarbonStorage());
    },
    onBack: () => {
      dispatch(revertStep());
    },
    fetchSiteCarbonStorage: async () => {
      await dispatch(fetchSiteSoilsCarbonStorage());
    },
    loading: loadingState === "loading",
    siteCarbonStorage: carbonStorage,
  };
};

function SiteSoilsCarbonStorageContainer() {
  const dispatch = useAppDispatch();
  const siteCarbonStorageState = useAppSelector((state) => state.siteCarbonStorage);

  return <SiteSoilsCarbonStorage {...mapProps(dispatch, siteCarbonStorageState)} />;
}

export default SiteSoilsCarbonStorageContainer;

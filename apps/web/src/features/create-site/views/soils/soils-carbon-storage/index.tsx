import { completeSoilsCarbonStorage } from "../../../application/createSite.reducer";
import SiteSoilsCarbonStorage from "./SiteSoilsCarbonStorage";

import { AppDispatch, RootState } from "@/app/application/store";
import { fetchCarbonStorageForSoils } from "@/features/create-site/application/siteSoilsCarbonStorage.actions";
import { SoilType } from "@/shared/domain/soils";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

const mapProps = (
  dispatch: AppDispatch,
  siteData: RootState["siteCreation"]["siteData"],
  siteCarbonStorage: RootState["siteCarbonStorage"],
) => {
  const siteCityCode = siteData.address?.cityCode ?? "";
  const fricheSoils = siteData.soilsDistribution ?? {};
  const { loadingState, carbonStorage } = siteCarbonStorage;

  return {
    onNext: () => {
      dispatch(completeSoilsCarbonStorage());
    },
    fetchSiteCarbonStorage: async () => {
      const soils = Object.entries(fricheSoils).map(([type, surfaceArea]) => ({
        type: type as SoilType,
        surfaceArea,
      }));
      await dispatch(
        fetchCarbonStorageForSoils({
          cityCode: siteCityCode,
          soils,
        }),
      );
    },
    loading: loadingState === "loading",
    siteCarbonStorage: carbonStorage,
  };
};

function SiteSoilsCarbonStorageContainer() {
  const dispatch = useAppDispatch();
  const siteData = useAppSelector((state) => state.siteCreation.siteData);
  const siteCarbonStorageState = useAppSelector((state) => state.siteCarbonStorage);

  return <SiteSoilsCarbonStorage {...mapProps(dispatch, siteData, siteCarbonStorageState)} />;
}

export default SiteSoilsCarbonStorageContainer;

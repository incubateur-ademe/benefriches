import {
  goToStep,
  SiteCreationStep,
} from "../../../application/createSite.reducer";
import SiteSoilsCarbonStorage from "./SiteSoilsCarbonStorage";

import { fetchCarbonStorageForSoils } from "@/features/create-site/application/siteSoilsCarbonStorage.actions";
import { SoilType } from "@/features/create-site/domain/siteFoncier.types";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";
import { AppDispatch, RootState } from "@/store";

const mapProps = (
  dispatch: AppDispatch,
  { siteCreation, siteCarbonStorage }: RootState,
) => {
  const siteCityCode = siteCreation.siteData.address?.cityCode ?? "";
  const fricheSoils = siteCreation.siteData.soilsSurfaceAreas ?? {};
  const { loadingState, carbonStorage } = siteCarbonStorage;

  return {
    onNext: () => {
      const nextStep = siteCreation.siteData.isFriche
        ? SiteCreationStep.SOIL_CONTAMINATION
        : SiteCreationStep.MANAGEMENT_INTRODUCTION;
      dispatch(goToStep(nextStep));
    },
    loadSiteCarbonStorage: async () => {
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
  const appState = useAppSelector((state) => state);

  return <SiteSoilsCarbonStorage {...mapProps(dispatch, appState)} />;
}

export default SiteSoilsCarbonStorageContainer;

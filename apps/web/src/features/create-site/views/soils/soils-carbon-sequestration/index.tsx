import {
  goToStep,
  SiteCreationStep,
} from "../../../application/createSite.reducer";
import SiteSoilsCarbonSequestration from "./SiteSoilsCarbonSequestration";

import { fetchCarbonSequestrationForSoils } from "@/features/create-site/application/siteSoilsCarbonSequestration.actions";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";
import { AppDispatch, RootState } from "@/store";

const mapProps = (
  dispatch: AppDispatch,
  { siteCreation, siteCarbonSequestration }: RootState,
) => {
  const siteCityCode = siteCreation.siteData.address?.cityCode ?? "";
  const fricheSoils = siteCreation.siteData.soils ?? {};
  const { loadingState, carbonSequestration } = siteCarbonSequestration;

  return {
    onNext: () => {
      const nextStep = siteCreation.siteData.isFriche
        ? SiteCreationStep.SOIL_CONTAMINATION
        : SiteCreationStep.MANAGEMENT_INTRODUCTION;
      dispatch(goToStep(nextStep));
    },
    loadSiteCarbonSequestration: () =>
      dispatch(
        fetchCarbonSequestrationForSoils({
          cityCode: siteCityCode,
          soils: fricheSoils,
        }),
      ),
    loading: loadingState === "loading",
    siteCarbonSequestration: carbonSequestration,
  };
};

function SiteSoilsCarbonSequestrationContainer() {
  const dispatch = useAppDispatch();
  const appState = useAppSelector((state) => state);

  return <SiteSoilsCarbonSequestration {...mapProps(dispatch, appState)} />;
}

export default SiteSoilsCarbonSequestrationContainer;

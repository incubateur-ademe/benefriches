import FricheSoilsCarbonSequestration from "./FricheSoilsCarbonSequestration";

import { goToNextStep } from "@/features/create-site/application/createFriche.reducer";
import { fetchCarbonSequestrationForSoils } from "@/features/create-site/application/siteSoilsCarbonSequestration.actions";
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/views/hooks/store.hooks";
import { AppDispatch, RootState } from "@/store";

const mapProps = (dispatch: AppDispatch, appState: RootState) => {
  const siteCityCode = appState.siteCreation.siteData.address?.cityCode ?? "";
  const fricheSoils = appState.fricheCreation.fricheData.soils ?? {};
  const { loadingState, carbonSequestration } =
    appState.siteCarbonSequestration;

  return {
    onNext: () => dispatch(goToNextStep()),
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

function FricheSoilsCarbonSequestrationContainer() {
  const dispatch = useAppDispatch();
  const appState = useAppSelector((state) => state);

  return <FricheSoilsCarbonSequestration {...mapProps(dispatch, appState)} />;
}

export default FricheSoilsCarbonSequestrationContainer;

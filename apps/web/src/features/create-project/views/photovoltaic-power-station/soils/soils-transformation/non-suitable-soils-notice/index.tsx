import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  nextStepRequested,
  previousStepRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectPVNonSuitableSoilsNoticeViewData } from "@/features/create-project/core/renewable-energy/step-handlers/soils-transformation/soils-transformation-non-suitable-soils-notice/soilsTransformationNonSuitableSoilsNotice.selector";

import NonSuitableSoilsNotice from "./NonSuitableSoilsNotice";

function NonSuitableSoilsNoticeContainer() {
  const dispatch = useAppDispatch();
  const { photovoltaicPanelsSurfaceArea: photovoltaicPanelsSurfaceAre, suitableSurfaceArea } =
    useAppSelector(selectPVNonSuitableSoilsNoticeViewData);

  return (
    <NonSuitableSoilsNotice
      photovoltaicPanelsSurfaceAre={photovoltaicPanelsSurfaceAre}
      suitableSurfaceArea={suitableSurfaceArea}
      onNext={() => dispatch(nextStepRequested())}
      onBack={() => dispatch(previousStepRequested())}
    />
  );
}

export default NonSuitableSoilsNoticeContainer;

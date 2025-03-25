import { completeNonSuitableSoilsNoticeStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { nonSuitableSoilsNoticeStepReverted } from "@/features/create-project/core/renewable-energy/actions/revert.actions";
import { selectPhotovoltaicPanelsSurfaceArea } from "@/features/create-project/core/renewable-energy/selectors/photovoltaicPowerStation.selectors";
import { selectSuitableSurfaceAreaForPhotovoltaicPanels } from "@/features/create-project/core/renewable-energy/selectors/soilsTransformation.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import NonSuitableSoilsNotice from "./NonSuitableSoilsNotice";

function NonSuitableSoilsNoticeContainer() {
  const dispatch = useAppDispatch();
  const photovoltaicPanelsSurfaceAre = useAppSelector(selectPhotovoltaicPanelsSurfaceArea);
  const suitableSurfaceArea = useAppSelector(selectSuitableSurfaceAreaForPhotovoltaicPanels);

  return (
    <NonSuitableSoilsNotice
      photovoltaicPanelsSurfaceAre={photovoltaicPanelsSurfaceAre}
      suitableSurfaceArea={suitableSurfaceArea}
      onNext={() => dispatch(completeNonSuitableSoilsNoticeStep())}
      onBack={() => dispatch(nonSuitableSoilsNoticeStepReverted())}
    />
  );
}

export default NonSuitableSoilsNoticeContainer;

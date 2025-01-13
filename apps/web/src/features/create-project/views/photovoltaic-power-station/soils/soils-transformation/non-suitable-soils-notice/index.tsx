import { selectPhotovoltaicPanelsSurfaceArea } from "@/features/create-project/application/renewable-energy/photovoltaicPowerStation.selectors";
import {
  completeNonSuitableSoilsNoticeStep,
  revertNonSuitableSoilsNoticeStep,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import { selectSuitableSurfaceAreaForPhotovoltaicPanels } from "@/features/create-project/application/renewable-energy/soilsTransformation.selectors";
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
      onBack={() => dispatch(revertNonSuitableSoilsNoticeStep())}
    />
  );
}

export default NonSuitableSoilsNoticeContainer;

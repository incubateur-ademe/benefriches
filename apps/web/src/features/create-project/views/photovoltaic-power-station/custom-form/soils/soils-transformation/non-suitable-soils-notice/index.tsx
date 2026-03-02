import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { stepReverted } from "@/features/create-project/core/actions/actionsUtils";
import { completeNonSuitableSoilsNoticeStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { selectPVNonSuitableSoilsNoticeViewData } from "@/features/create-project/core/renewable-energy/selectors/soilsTransformation.selectors";

import NonSuitableSoilsNotice from "./NonSuitableSoilsNotice";

function NonSuitableSoilsNoticeContainer() {
  const dispatch = useAppDispatch();
  const { photovoltaicPanelsSurfaceArea: photovoltaicPanelsSurfaceAre, suitableSurfaceArea } =
    useAppSelector(selectPVNonSuitableSoilsNoticeViewData);

  return (
    <NonSuitableSoilsNotice
      photovoltaicPanelsSurfaceAre={photovoltaicPanelsSurfaceAre}
      suitableSurfaceArea={suitableSurfaceArea}
      onNext={() => dispatch(completeNonSuitableSoilsNoticeStep())}
      onBack={() => dispatch(stepReverted())}
    />
  );
}

export default NonSuitableSoilsNoticeContainer;

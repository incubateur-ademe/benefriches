import NonSuitableSoilsNotice from "./NonSuitableSoilsNotice";

import {
  completeNonSuitableSoilsNoticeStep,
  revertNonSuitableSoilsNoticeStep,
} from "@/features/create-project/application/createProject.reducer";
import {
  selectPhotovoltaicPanelsSurfaceArea,
  selectSuitableSurfaceAreaForPhotovoltaicPanels,
} from "@/features/create-project/application/createProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

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

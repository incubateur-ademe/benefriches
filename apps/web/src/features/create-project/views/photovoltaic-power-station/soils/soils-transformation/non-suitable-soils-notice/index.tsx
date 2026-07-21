import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";

import NonSuitableSoilsNotice from "./NonSuitableSoilsNotice";

function NonSuitableSoilsNoticeContainer() {
  const { onNext, onBack, selectPVNonSuitableSoilsNoticeViewData } = useRenewableEnergyForm();
  const { photovoltaicPanelsSurfaceArea: photovoltaicPanelsSurfaceAre, suitableSurfaceArea } =
    useAppSelector(selectPVNonSuitableSoilsNoticeViewData);

  return (
    <NonSuitableSoilsNotice
      photovoltaicPanelsSurfaceAre={photovoltaicPanelsSurfaceAre}
      suitableSurfaceArea={suitableSurfaceArea}
      onNext={onNext}
      onBack={onBack}
    />
  );
}

export default NonSuitableSoilsNoticeContainer;

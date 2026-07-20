import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import NonSuitableSoilsNotice from "@/features/create-project/views/photovoltaic-power-station/soils/soils-transformation/non-suitable-soils-notice/NonSuitableSoilsNotice";
import { updateProjectFormRenewableEnergyActions } from "@/features/update-project/core/updateProject.actions";
import { selectPVNonSuitableSoilsNoticeViewData } from "@/features/update-project/core/updateProjectRenewableEnergy.selectors";

function NonSuitableSoilsNoticeContainer() {
  const dispatch = useAppDispatch();
  const { photovoltaicPanelsSurfaceArea: photovoltaicPanelsSurfaceAre, suitableSurfaceArea } =
    useAppSelector(selectPVNonSuitableSoilsNoticeViewData);

  return (
    <NonSuitableSoilsNotice
      photovoltaicPanelsSurfaceAre={photovoltaicPanelsSurfaceAre}
      suitableSurfaceArea={suitableSurfaceArea}
      onNext={() => dispatch(updateProjectFormRenewableEnergyActions.nextStepRequested())}
      onBack={() => dispatch(updateProjectFormRenewableEnergyActions.previousStepRequested())}
    />
  );
}

export default NonSuitableSoilsNoticeContainer;

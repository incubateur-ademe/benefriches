import { selectSiteSurfaceArea } from "@/features/create-project/core/createProject.selectors";
import {
  completeCustomSoilsSurfaceAreaAllocationStep,
  revertCustomSoilsSurfaceAreaAllocationStep,
} from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { selectPhotovoltaicPanelsSurfaceArea } from "@/features/create-project/core/renewable-energy/selectors/photovoltaicPowerStation.selectors";
import {
  selectBaseSoilsDistributionForTransformation,
  selectFutureSoils,
} from "@/features/create-project/core/renewable-energy/selectors/soilsTransformation.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import FutureSoilsSurfaceAreaForm, { FormValues } from "./FutureSoilsSurfaceAreaForm";

function FutureSoilsSurfaceAreaFormContainer() {
  const dispatch = useAppDispatch();
  const selectedSoils = useAppSelector(selectFutureSoils);
  const siteSurfaceArea = useAppSelector(selectSiteSurfaceArea);
  const photovoltaicPanelsSurfaceArea = useAppSelector(selectPhotovoltaicPanelsSurfaceArea);
  const currentSoilsDistribution = useAppSelector(selectBaseSoilsDistributionForTransformation);

  return (
    <FutureSoilsSurfaceAreaForm
      selectedSoils={selectedSoils}
      siteSurfaceArea={siteSurfaceArea}
      currentSoilsDistribution={currentSoilsDistribution}
      photovoltaicPanelsSurfaceArea={photovoltaicPanelsSurfaceArea}
      onSubmit={(data: FormValues) => {
        dispatch(completeCustomSoilsSurfaceAreaAllocationStep(data));
      }}
      onBack={() => {
        dispatch(revertCustomSoilsSurfaceAreaAllocationStep());
      }}
    />
  );
}

export default FutureSoilsSurfaceAreaFormContainer;

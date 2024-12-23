import { selectSiteSurfaceArea } from "@/features/create-project/application/createProject.selectors";
import {
  completeCustomSoilsSurfaceAreaAllocationStep,
  revertCustomSoilsSurfaceAreaAllocationStep,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import {
  selectBaseSoilsDistributionForTransformation,
  selectFutureSoils,
  selectPhotovoltaicPanelsSurfaceArea,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.selector";
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

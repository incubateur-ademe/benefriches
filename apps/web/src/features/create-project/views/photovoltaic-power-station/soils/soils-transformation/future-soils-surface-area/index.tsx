import FutureSoilsSurfaceAreaForm, { FormValues } from "./FutureSoilsSurfaceAreaForm";

import {
  completeCustomSoilsSurfaceAreaAllocationStep,
  revertCustomSoilsSurfaceAreaAllocationStep,
} from "@/features/create-project/application/createProject.reducer";
import {
  selectBaseSoilsDistributionForTransformation,
  selectFutureSoils,
  selectPhotovoltaicPanelsSurfaceArea,
  selectSiteSurfaceArea,
} from "@/features/create-project/application/createProject.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

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

import { completeCustomSoilsSurfaceAreaAllocationStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { customSoilsSurfaceAreaAllocationStepReverted } from "@/features/create-project/core/renewable-energy/actions/revert.actions";
import { selectFutureSoilsSurfaceAreasViewData } from "@/features/create-project/core/renewable-energy/selectors/soilsTransformation.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import FutureSoilsSurfaceAreaForm, { FormValues } from "./FutureSoilsSurfaceAreaForm";

function FutureSoilsSurfaceAreaFormContainer() {
  const dispatch = useAppDispatch();
  const {
    initialValues,
    baseSoilsDistribution,
    photovoltaicPanelsSurfaceArea,
    siteSurfaceArea,
    selectedSoils,
  } = useAppSelector(selectFutureSoilsSurfaceAreasViewData);

  return (
    <FutureSoilsSurfaceAreaForm
      initialValues={initialValues}
      selectedSoils={selectedSoils}
      siteSurfaceArea={siteSurfaceArea}
      currentSoilsDistribution={baseSoilsDistribution}
      photovoltaicPanelsSurfaceArea={photovoltaicPanelsSurfaceArea}
      onSubmit={(data: FormValues) => {
        dispatch(completeCustomSoilsSurfaceAreaAllocationStep(data));
      }}
      onBack={() => {
        dispatch(customSoilsSurfaceAreaAllocationStepReverted());
      }}
    />
  );
}

export default FutureSoilsSurfaceAreaFormContainer;

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectFutureSoilsSurfaceAreasViewData } from "@/features/create-project/core/renewable-energy/step-handlers/soils-transformation/futureSoilsSurfaceArea.selector";

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
        dispatch(
          requestStepCompletion({
            stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
            answers: { soilsDistribution: data },
          }),
        );
      }}
      onBack={() => {
        dispatch(navigateToPrevious());
      }}
    />
  );
}

export default FutureSoilsSurfaceAreaFormContainer;

import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";

import FutureSoilsSurfaceAreaForm, { FormValues } from "./FutureSoilsSurfaceAreaForm";

function FutureSoilsSurfaceAreaFormContainer() {
  const { onBack, onRequestStepCompletion, selectFutureSoilsSurfaceAreasViewData } =
    useRenewableEnergyForm();
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
        onRequestStepCompletion({
          stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
          answers: { soilsDistribution: data },
        });
      }}
      onBack={onBack}
    />
  );
}

export default FutureSoilsSurfaceAreaFormContainer;

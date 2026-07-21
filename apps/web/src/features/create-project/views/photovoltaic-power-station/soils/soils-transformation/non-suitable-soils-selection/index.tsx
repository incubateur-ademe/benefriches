import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";

import NonSuitableSoilsSelection, { FormValues } from "./NonSuitableSoilsSelection";

function NonSuitableSoilsSelectionContainer() {
  const { onBack, onRequestStepCompletion, selectNonSuitableSelectionViewData } =
    useRenewableEnergyForm();
  const { initialValues, nonSuitableSoils, missingSuitableSurfaceArea } = useAppSelector(
    selectNonSuitableSelectionViewData,
  );

  return (
    <NonSuitableSoilsSelection
      initialValues={initialValues}
      nonSuitableSoils={nonSuitableSoils}
      missingSuitableSurfaceArea={missingSuitableSurfaceArea}
      onSubmit={(data: FormValues) => {
        onRequestStepCompletion({
          stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION",
          answers: { nonSuitableSoilsToTransform: data.soils },
        });
      }}
      onBack={onBack}
    />
  );
}

export default NonSuitableSoilsSelectionContainer;

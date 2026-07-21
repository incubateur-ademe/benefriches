import { useAppSelector } from "@/app/hooks/store.hooks";
import { useRenewableEnergyForm } from "@/features/create-project/views/photovoltaic-power-station/renewable-energy-form/useRenewableEnergyForm";

import NonSuitableSoilsSurfaceForm, { FormValues } from "./NonSuitableSoilsSurfaceToTransformForm";

function NonSuitableSoilsSurfaceFormContainer() {
  const { onBack, onRequestStepCompletion, selectNonSuitableSoilsSurfaceAreaToTransformViewData } =
    useRenewableEnergyForm();
  const { initialValues, soilsToTransform, missingSuitableSurfaceArea } = useAppSelector(
    selectNonSuitableSoilsSurfaceAreaToTransformViewData,
  );

  return (
    <NonSuitableSoilsSurfaceForm
      initialValues={{ soilsTransformation: initialValues }}
      soilsToTransform={soilsToTransform}
      missingSuitableSurfaceArea={missingSuitableSurfaceArea}
      onSubmit={(data: FormValues) => {
        onRequestStepCompletion({
          stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE",
          answers: { nonSuitableSoilsSurfaceAreaToTransform: data.soilsTransformation },
        });
      }}
      onBack={onBack}
    />
  );
}

export default NonSuitableSoilsSurfaceFormContainer;

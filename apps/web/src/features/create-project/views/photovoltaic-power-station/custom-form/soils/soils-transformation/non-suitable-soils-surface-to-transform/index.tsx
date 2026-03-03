import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectNonSuitableSoilsSurfaceAreaToTransformViewData } from "@/features/create-project/core/renewable-energy/step-handlers/soils-transformation/soils-transformation-non-suitable-soils-surface/soilsTransformationNonSuitableSoilsSurface.selector";

import NonSuitableSoilsSurfaceForm, { FormValues } from "./NonSuitableSoilsSurfaceToTransformForm";

function NonSuitableSoilsSurfaceFormContainer() {
  const dispatch = useAppDispatch();
  const { initialValues, soilsToTransform, missingSuitableSurfaceArea } = useAppSelector(
    selectNonSuitableSoilsSurfaceAreaToTransformViewData,
  );

  return (
    <NonSuitableSoilsSurfaceForm
      initialValues={{ soilsTransformation: initialValues }}
      soilsToTransform={soilsToTransform}
      missingSuitableSurfaceArea={missingSuitableSurfaceArea}
      onSubmit={(data: FormValues) => {
        dispatch(
          requestStepCompletion({
            stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE",
            answers: { nonSuitableSoilsSurfaceAreaToTransform: data.soilsTransformation },
          }),
        );
      }}
      onBack={() => {
        dispatch(navigateToPrevious());
      }}
    />
  );
}

export default NonSuitableSoilsSurfaceFormContainer;

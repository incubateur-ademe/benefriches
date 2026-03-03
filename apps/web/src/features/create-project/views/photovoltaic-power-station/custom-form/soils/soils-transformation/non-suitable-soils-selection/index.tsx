import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectNonSuitableSelectionViewData } from "@/features/create-project/core/renewable-energy/step-handlers/soils-transformation/nonSuitableSoilsSelection.selector";

import NonSuitableSoilsSelection, { FormValues } from "./NonSuitableSoilsSelection";

function NonSuitableSoilsSelectionContainer() {
  const dispatch = useAppDispatch();
  const { initialValues, nonSuitableSoils, missingSuitableSurfaceArea } = useAppSelector(
    selectNonSuitableSelectionViewData,
  );

  return (
    <NonSuitableSoilsSelection
      initialValues={initialValues}
      nonSuitableSoils={nonSuitableSoils}
      missingSuitableSurfaceArea={missingSuitableSurfaceArea}
      onSubmit={(data: FormValues) => {
        dispatch(
          requestStepCompletion({
            stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION",
            answers: { nonSuitableSoilsToTransform: data.soils },
          }),
        );
      }}
      onBack={() => {
        dispatch(navigateToPrevious());
      }}
    />
  );
}

export default NonSuitableSoilsSelectionContainer;

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectNonSuitableSelectionViewData } from "@/features/create-project/core/renewable-energy/step-handlers/soils-transformation/soils-transformation-non-suitable-soils-selection/soilsTransformationNonSuitableSoilsSelection.selector";

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
          stepCompletionRequested({
            stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION",
            answers: { nonSuitableSoilsToTransform: data.soils },
          }),
        );
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default NonSuitableSoilsSelectionContainer;

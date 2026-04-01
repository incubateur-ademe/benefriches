import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectFutureSoilsSelectionViewData } from "@/features/create-project/core/renewable-energy/step-handlers/soils-transformation/soils-transformation-future-soils-selection/soilsTransformationFutureSoilsSelection.selector";

import FutureSoilsSelectionForm, { FormValues } from "./FutureSoilsSelectionForm";

function FutureSoilsSelectionFormContainer() {
  const dispatch = useAppDispatch();
  const { initialValues, selectableSoils, baseSoilsDistribution } = useAppSelector(
    selectFutureSoilsSelectionViewData,
  );

  return (
    <FutureSoilsSelectionForm
      initialValues={{ soils: initialValues }}
      selectableSoils={selectableSoils}
      currentSoilsDistribution={baseSoilsDistribution}
      onSubmit={(data: FormValues) => {
        dispatch(
          stepCompletionRequested({
            stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",
            answers: { futureSoilsSelection: data.soils },
          }),
        );
      }}
      onBack={() => {
        dispatch(previousStepRequested());
      }}
    />
  );
}

export default FutureSoilsSelectionFormContainer;

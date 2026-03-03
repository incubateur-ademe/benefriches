import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { selectFutureSoilsSelectionViewData } from "@/features/create-project/core/renewable-energy/step-handlers/soils-transformation/futureSoilsSelection.selector";

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
          requestStepCompletion({
            stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",
            answers: { futureSoilsSelection: data.soils },
          }),
        );
      }}
      onBack={() => {
        dispatch(navigateToPrevious());
      }}
    />
  );
}

export default FutureSoilsSelectionFormContainer;

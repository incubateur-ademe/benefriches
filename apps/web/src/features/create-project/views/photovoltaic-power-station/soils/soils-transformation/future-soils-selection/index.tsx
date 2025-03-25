import { completeCustomSoilsSelectionStep } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { customSoilsSelectionStepReverted } from "@/features/create-project/core/renewable-energy/actions/revert.actions";
import { selectFutureSoilsSelectionViewData } from "@/features/create-project/core/renewable-energy/selectors/soilsTransformation.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

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
        dispatch(completeCustomSoilsSelectionStep(data.soils));
      }}
      onBack={() => {
        dispatch(customSoilsSelectionStepReverted());
      }}
    />
  );
}

export default FutureSoilsSelectionFormContainer;

import {
  completeCustomSoilsSelectionStep,
  revertCustomSoilsSelectionStep,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import {
  selectBaseSoilsDistributionForTransformation,
  selectTransformableSoils,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.selector";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import FutureSoilsSelectionForm, { FormValues } from "./FutureSoilsSelectionForm";

function FutureSoilsSelectionFormContainer() {
  const dispatch = useAppDispatch();
  const selectableSoils = useAppSelector(selectTransformableSoils);
  const currentSoilsDistribution = useAppSelector(selectBaseSoilsDistributionForTransformation);

  return (
    <FutureSoilsSelectionForm
      selectableSoils={selectableSoils}
      currentSoilsDistribution={currentSoilsDistribution}
      onSubmit={(data: FormValues) => {
        dispatch(completeCustomSoilsSelectionStep(data.soils));
      }}
      onBack={() => {
        dispatch(revertCustomSoilsSelectionStep());
      }}
    />
  );
}

export default FutureSoilsSelectionFormContainer;

import {
  completeCustomSoilsSelectionStep,
  revertCustomSoilsSelectionStep,
} from "@/features/create-project/application/createProject.reducer";
import {
  selectBaseSoilsDistributionForTransformation,
  selectTransformableSoils,
} from "@/features/create-project/application/createProject.selectors";
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

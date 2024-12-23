import {
  completeSoilsTransformationProjectSelectionStep,
  revertSoilsTransformationProjectSelectionStep,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import SoilsTransformationProjectForm, { FormValues } from "./SoilsTransformationProjectForm";

function SoilsTransformationProjectFormContainer() {
  const dispatch = useAppDispatch();

  return (
    <SoilsTransformationProjectForm
      onSubmit={(data: FormValues) => {
        dispatch(completeSoilsTransformationProjectSelectionStep(data.soilsTransformationProject));
      }}
      onBack={() => {
        dispatch(revertSoilsTransformationProjectSelectionStep());
      }}
    />
  );
}

export default SoilsTransformationProjectFormContainer;

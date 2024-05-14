import SoilsTransformationProjectForm, { FormValues } from "./SoilsTransformationProjectForm";

import {
  completeSoilsTransformationProjectSelectionStep,
  revertSoilsTransformationProjectSelectionStep,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

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

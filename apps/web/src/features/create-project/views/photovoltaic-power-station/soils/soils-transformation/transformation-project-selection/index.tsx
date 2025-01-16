import {
  completeSoilsTransformationProjectSelectionStep,
  revertSoilsTransformationProjectSelectionStep,
} from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import SoilsTransformationProjectForm, { FormValues } from "./SoilsTransformationProjectForm";

function SoilsTransformationProjectFormContainer() {
  const initialValue = useAppSelector(
    (state) => state.projectCreation.renewableEnergyProject.creationData.soilsTransformationProject,
  );
  const dispatch = useAppDispatch();

  return (
    <SoilsTransformationProjectForm
      initialValues={initialValue ? { soilsTransformationProject: initialValue } : undefined}
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

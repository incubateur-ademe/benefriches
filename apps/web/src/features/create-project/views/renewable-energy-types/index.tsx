import { completeRenewableEnergyType } from "@/features/create-project/core/renewable-energy/actions/renewableEnergy.actions";
import { selectRenewableEnergyType } from "@/features/create-project/core/renewable-energy/selectors/renewableEnergy.selector";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import { stepRevertAttempted } from "../../core/actions/actionsUtils";
import RenewableEnergyTypeForm from "./RenewableEnergyTypeForm";

function ProjectRenewableEnergyTypesFormContainer() {
  const dispatch = useAppDispatch();
  const initialValue = useAppSelector(selectRenewableEnergyType);

  return (
    <RenewableEnergyTypeForm
      initialValues={initialValue ? { renewableEnergyType: initialValue } : undefined}
      onSubmit={({ renewableEnergyType }) => {
        dispatch(completeRenewableEnergyType(renewableEnergyType));
      }}
      onBack={() => dispatch(stepRevertAttempted())}
    />
  );
}

export default ProjectRenewableEnergyTypesFormContainer;

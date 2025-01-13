import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import {
  completeRenewableEnergyType,
  revertRenewableEnergyType,
} from "../../application/renewable-energy/renewableEnergy.actions";
import { selectRenewableEnergyType } from "../../application/renewable-energy/renewableEnergy.selector";
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
      onBack={() => dispatch(revertRenewableEnergyType())}
    />
  );
}

export default ProjectRenewableEnergyTypesFormContainer;

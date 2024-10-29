import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import {
  completeRenewableEnergyType,
  revertRenewableEnergyType,
} from "../../application/renewable-energy/renewableEnergy.actions";
import RenewableEnergyTypeForm from "./RenewableEnergyTypeForm";

function ProjectRenewableEnergyTypesFormContainer() {
  const dispatch = useAppDispatch();
  return (
    <RenewableEnergyTypeForm
      onSubmit={({ renewableEnergyType }) => {
        dispatch(completeRenewableEnergyType(renewableEnergyType));
      }}
      onBack={() => dispatch(revertRenewableEnergyType())}
    />
  );
}

export default ProjectRenewableEnergyTypesFormContainer;

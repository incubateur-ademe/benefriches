import {
  completeRenewableEnergyDevelopmentPlanType,
  revertRenewableEnergyDevelopmentPlanType,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import RenewableEnergyTypeForm from "./RenewableEnergyTypeForm";

function ProjectRenewableEnergyTypesFormContainer() {
  const dispatch = useAppDispatch();
  return (
    <RenewableEnergyTypeForm
      onSubmit={({ renewableEnergyType }) => {
        dispatch(completeRenewableEnergyDevelopmentPlanType(renewableEnergyType));
      }}
      onBack={() => dispatch(revertRenewableEnergyDevelopmentPlanType())}
    />
  );
}

export default ProjectRenewableEnergyTypesFormContainer;

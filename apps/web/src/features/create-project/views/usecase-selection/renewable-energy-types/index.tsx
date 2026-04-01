import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import {
  renewableEnergyTypeCompleted,
  stepReverted,
} from "@/features/create-project/core/usecase-selection/useCaseSelection.actions";
import { selectRenewableEnergyTypeViewData } from "@/features/create-project/core/usecase-selection/useCaseSelection.selectors";

import RenewableEnergyTypeForm from "./RenewableEnergyTypeForm";

function ProjectRenewableEnergyTypesFormContainer() {
  const dispatch = useAppDispatch();
  const { projectType } = useAppSelector(selectRenewableEnergyTypeViewData);

  return (
    <RenewableEnergyTypeForm
      initialValues={
        projectType && projectType === "PHOTOVOLTAIC_POWER_PLANT"
          ? { renewableEnergyType: "PHOTOVOLTAIC_POWER_PLANT" }
          : undefined
      }
      onSubmit={({ renewableEnergyType }) => {
        dispatch(renewableEnergyTypeCompleted(renewableEnergyType));
      }}
      onBack={() => dispatch(stepReverted())}
    />
  );
}

export default ProjectRenewableEnergyTypesFormContainer;

import { RenewableEnergyType } from "../../domain/project.types";
import ProjectTypeForm from "./ProjectTypeForm";

import {
  goToStep,
  ProjectCreationStep,
  setRenewableEnergyTypes,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function ProjectRenewableEnergyTypesFormContainer() {
  const dispatch = useAppDispatch();
  return (
    <ProjectTypeForm
      onSubmit={(data) => {
        const nextStep = data.renewableEnergyTypes.includes(
          RenewableEnergyType.PHOTOVOLTAIC,
        )
          ? ProjectCreationStep.PHOTOVOLTAIC_KEY_PARAMETER
          : ProjectCreationStep.CREATION_CONFIRMATION;
        dispatch(setRenewableEnergyTypes(data.renewableEnergyTypes));
        dispatch(goToStep(nextStep));
      }}
    />
  );
}

export default ProjectRenewableEnergyTypesFormContainer;

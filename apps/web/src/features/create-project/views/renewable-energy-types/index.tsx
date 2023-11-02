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
        dispatch(setRenewableEnergyTypes(data.renewableEnergyTypes));
        dispatch(goToStep(ProjectCreationStep.STAKEHOLDERS_INTRODUCTION));
      }}
    />
  );
}

export default ProjectRenewableEnergyTypesFormContainer;

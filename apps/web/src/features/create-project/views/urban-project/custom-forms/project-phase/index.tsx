import {
  projectPhaseCompleted,
  projectPhaseReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import ProjectPhaseForm from "../../../common-views/project-phase/ProjectPhaseForm";

function ProjectPhaseFormContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectPhaseForm
      onSubmit={(phase) => {
        dispatch(projectPhaseCompleted(phase));
      }}
      onBack={() => {
        dispatch(projectPhaseReverted());
      }}
    />
  );
}

export default ProjectPhaseFormContainer;

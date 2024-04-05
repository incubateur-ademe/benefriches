import ProjectPhaseForm, { FormValues } from "./ProjectPhaseForm";

import {
  completeProjectPhaseStep,
  revertProjectPhaseStep,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function ProjectPhaseFormContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectPhaseForm
      onSubmit={(formData: FormValues) => {
        dispatch(completeProjectPhaseStep(formData));
      }}
      onBack={() => {
        dispatch(revertProjectPhaseStep());
      }}
    />
  );
}

export default ProjectPhaseFormContainer;

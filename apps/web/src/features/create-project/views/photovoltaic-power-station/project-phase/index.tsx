import {
  completeProjectPhaseStep,
  revertProjectPhaseStep,
} from "@/features/create-project/application/createProject.reducer";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import ProjectPhaseForm, { FormValues } from "./ProjectPhaseForm";

function ProjectPhaseFormContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectPhaseForm
      onSubmit={(formData: FormValues) => {
        dispatch(completeProjectPhaseStep({ phase: formData.phase ?? "unknown" }));
      }}
      onBack={() => {
        dispatch(revertProjectPhaseStep());
      }}
    />
  );
}

export default ProjectPhaseFormContainer;

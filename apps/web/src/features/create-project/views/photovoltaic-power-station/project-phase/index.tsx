import {
  completeProjectPhaseStep,
  revertProjectPhaseStep,
} from "@/features/create-project/application/renewable-energy/renewableEnergy.actions";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import ProjectPhaseForm from "../../common-views/project-phase/ProjectPhaseForm";

function ProjectPhaseFormContainer() {
  const dispatch = useAppDispatch();

  return (
    <ProjectPhaseForm
      excludedPhases={["planning"]}
      onSubmit={(phase) => {
        dispatch(completeProjectPhaseStep({ phase }));
      }}
      onBack={() => {
        dispatch(revertProjectPhaseStep());
      }}
    />
  );
}

export default ProjectPhaseFormContainer;

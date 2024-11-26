import { URBAN_PROJECT_PHASE_VALUES } from "shared";

import {
  projectPhaseCompleted,
  projectPhaseReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import {
  getHintTextForUrbanProjectPhase,
  getLabelForUrbanProjectPhase,
} from "@/shared/domain/projectPhase";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

import ProjectPhaseForm from "../../../common-views/project-phase/ProjectPhaseForm";

function ProjectPhaseFormContainer() {
  const dispatch = useAppDispatch();

  const options = URBAN_PROJECT_PHASE_VALUES.map((phase) => ({
    value: phase,
    label: getLabelForUrbanProjectPhase(phase),
    hintText: getHintTextForUrbanProjectPhase(phase),
  }));

  return (
    <ProjectPhaseForm
      projectPhaseOptions={options}
      onSubmit={({ phase }) => {
        dispatch(projectPhaseCompleted(phase ?? "unknown"));
      }}
      onBack={() => {
        dispatch(projectPhaseReverted());
      }}
    />
  );
}

export default ProjectPhaseFormContainer;

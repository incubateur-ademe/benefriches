import { URBAN_PROJECT_PHASE_VALUES } from "shared";

import {
  projectPhaseCompleted,
  projectPhaseReverted,
} from "@/features/create-project/application/urban-project/urbanProject.actions";
import { selectProjectPhase } from "@/features/create-project/application/urban-project/urbanProject.selectors";
import {
  getHintTextForUrbanProjectPhase,
  getLabelForUrbanProjectPhase,
  getPictogramForProjectPhase,
} from "@/shared/domain/projectPhase";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectPhaseForm from "../../../common-views/project-phase/ProjectPhaseForm";

function ProjectPhaseFormContainer() {
  const dispatch = useAppDispatch();
  const initialValues = useAppSelector(selectProjectPhase);

  const options = URBAN_PROJECT_PHASE_VALUES.map((phase) => ({
    value: phase,
    label: getLabelForUrbanProjectPhase(phase),
    hintText: getHintTextForUrbanProjectPhase(phase),
    pictogram: getPictogramForProjectPhase(phase),
  }));

  return (
    <ProjectPhaseForm
      initialValues={initialValues && { phase: initialValues }}
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

import { URBAN_PROJECT_PHASE_VALUES } from "shared";

import { stepRevertAttempted } from "@/features/create-project/core/actions/actionsUtils";
import { projectPhaseCompleted } from "@/features/create-project/core/urban-project/actions/urbanProject.actions";
import { selectProjectPhase } from "@/features/create-project/core/urban-project/selectors/urbanProject.selectors";
import {
  getHintTextForUrbanProjectPhase,
  getLabelForUrbanProjectPhase,
  getPictogramForProjectPhase,
} from "@/shared/core/projectPhase";
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
        dispatch(stepRevertAttempted());
      }}
    />
  );
}

export default ProjectPhaseFormContainer;

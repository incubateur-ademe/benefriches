import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { projectPhaseCompleted } from "@/features/create-project/core/usecase-selection/useCaseSelection.actions";
import { selectProjectPhaseViewData } from "@/features/create-project/core/usecase-selection/useCaseSelection.selectors";
import ProjectPhaseForm from "@/features/create-project/views/usecase-selection/project-phase/ProjectPhaseForm";

function ProjectPhaseFormContainer() {
  const dispatch = useAppDispatch();
  const { projectPhase } = useAppSelector(selectProjectPhaseViewData);

  return (
    <ProjectPhaseForm
      initialValues={{ phase: projectPhase }}
      onSubmit={({ phase }) => {
        dispatch(projectPhaseCompleted(phase ?? "unknown"));
      }}
    />
  );
}

export default ProjectPhaseFormContainer;

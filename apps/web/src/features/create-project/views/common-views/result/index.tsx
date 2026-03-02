import { useAppSelector } from "@/app/hooks/store.hooks";
import { selectProjectId } from "@/features/create-project/core/createProject.selectors";
import { selectShouldGoThroughOnboarding } from "@/features/projects/application/project-impacts/impactsOnboardingSkip.selectors";

import ProjectCreationResult from "./ProjectCreationResult";

type Props = {
  saveState: "idle" | "loading" | "success" | "error";
  projectName: string;
  onBack: () => void;
};

function ProjectCreationResultContainer({ onBack, projectName, saveState }: Props) {
  const projectId = useAppSelector(selectProjectId);
  const shouldGoThroughOnboarding = useAppSelector(selectShouldGoThroughOnboarding);

  return (
    <ProjectCreationResult
      projectId={projectId}
      projectName={projectName}
      loadingState={saveState}
      onBack={onBack}
      shouldGoThroughOnboarding={shouldGoThroughOnboarding}
    />
  );
}

export default ProjectCreationResultContainer;

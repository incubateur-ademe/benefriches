import { useAppSelector } from "@/app/hooks/store.hooks";
import { selectCommonResultViewData } from "@/features/create-project/core/createProject.selectors";

import ProjectCreationResult from "./ProjectCreationResult";

type Props = {
  saveState: "idle" | "loading" | "success" | "error";
  projectName: string;
  onBack: () => void;
};

function ProjectCreationResultContainer({ onBack, projectName, saveState }: Props) {
  const { projectId, shouldGoThroughOnboarding } = useAppSelector(selectCommonResultViewData);

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

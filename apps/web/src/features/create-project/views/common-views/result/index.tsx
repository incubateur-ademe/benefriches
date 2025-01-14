import {
  selectProjectId,
  selectSiteData,
} from "@/features/create-project/core/createProject.selectors";
import { useAppSelector } from "@/shared/views/hooks/store.hooks";

import ProjectCreationResult from "./ProjectCreationResult";

type Props = {
  saveState: "idle" | "loading" | "success" | "error";
  projectName: string;
  onBack: () => void;
};

function ProjectCreationResultContainer({ onBack, projectName, saveState }: Props) {
  const projectId = useAppSelector(selectProjectId);
  const siteData = useAppSelector(selectSiteData);

  return (
    <ProjectCreationResult
      projectId={projectId}
      projectName={projectName}
      siteName={siteData?.name ?? ""}
      loadingState={saveState}
      onBack={onBack}
    />
  );
}

export default ProjectCreationResultContainer;

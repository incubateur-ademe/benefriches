import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import useDuplicateProject from "@/shared/views/project/useDuplicateProject";
import { routes } from "@/shared/views/router";

import { selectProjectsImpactsViewData } from "../../../application/project-impacts/projectImpacts.reducer";
import ProjectPageHeader from "./ProjectPageHeader";

const ProjectPageHeaderContainer = ({ projectId }: { projectId: string }) => {
  const projectContext = useAppSelector(selectProjectsImpactsViewData);
  const { onDuplicateProject } = useDuplicateProject(projectId, "impacts");

  const headerProps = {
    projectType: projectContext.type,
    projectName: projectContext.name,
    siteName: projectContext.siteName,
    isExpressProject: projectContext.isExpressProject,
    siteFeaturesHref: routes.siteFeatures({ siteId: projectContext.siteId }).href,
    onDuplicateProject,
    onSuccessArchiveProject: () => {
      routes.myEvaluations().replace();
    },
    projectId,
    updateProjectLinkProps: routes.updateProject({ projectId, from: "impacts" }).link,
    createProjectLinkProps: routes.createProject({ siteId: projectContext.siteId }).link,
  };

  return <ProjectPageHeader {...headerProps} />;
};

export default ProjectPageHeaderContainer;

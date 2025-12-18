import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { routes } from "@/shared/views/router";

import { selectProjectsImpactsViewData } from "../../../application/project-impacts/projectImpacts.reducer";
import useDuplicateProject from "../useDuplicateProject";
import ProjectPageHeader from "./ProjectPageHeader";

const ProjectPageHeaderContainer = ({ projectId }: { projectId: string }) => {
  const projectContext = useAppSelector(selectProjectsImpactsViewData);
  const { onDuplicateProject } = useDuplicateProject(projectId);

  const headerProps = {
    projectType: projectContext.type,
    projectName: projectContext.name,
    siteName: projectContext.siteName,
    isExpressProject: projectContext.isExpressProject,
    siteFeaturesHref: routes.siteFeatures({ siteId: projectContext.siteId }).href,
    onDuplicateProject,
    updateProjectLinkProps: routes.updateProject({ projectId }).link,
    createProjectLinkProps: routes.createProject({ siteId: projectContext.siteId }).link,
  };

  return <ProjectPageHeader {...headerProps} />;
};

export default ProjectPageHeaderContainer;

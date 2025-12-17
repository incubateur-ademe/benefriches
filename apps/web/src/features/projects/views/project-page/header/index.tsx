import { useAppSelector } from "@/shared/views/hooks/store.hooks";
import { routes } from "@/shared/views/router";

import { selectProjectsImpactsViewData } from "../../../application/project-impacts/projectImpacts.reducer";
import ProjectPageHeader from "./ProjectPageHeader";

const ProjectPageHeaderContainer = () => {
  const projectContext = useAppSelector(selectProjectsImpactsViewData);

  const headerProps = {
    projectType: projectContext.type,
    projectName: projectContext.name,
    siteName: projectContext.siteName,
    isExpressProject: projectContext.isExpressProject,
    siteFeaturesHref: routes.siteFeatures({ siteId: projectContext.siteId }).href,
  };

  return <ProjectPageHeader {...headerProps} />;
};

export default ProjectPageHeaderContainer;

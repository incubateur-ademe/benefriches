import { useAppSelector } from "@/app/hooks/store.hooks";
import { routes } from "@/app/router";
import { selectImpactsContextData } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import useDuplicateProject from "@/shared/views/project/useDuplicateProject";

import ProjectPageHeader from "./ProjectPageHeader";

const ProjectPageHeaderContainer = ({ projectId }: { projectId: string }) => {
  const contextData = useAppSelector(selectImpactsContextData);
  const { onDuplicateProject } = useDuplicateProject(projectId, "impacts");

  const headerProps = {
    projectType: contextData?.projectDevelopmentPlan.type ?? "URBAN_PROJECT",
    projectName: contextData?.projectName ?? "",
    siteName: contextData?.relatedSiteName ?? "",
    isExpressProject: contextData?.isExpressProject ?? false,
    siteFeaturesHref: routes.siteFeatures({ siteId: contextData?.relatedSiteId ?? "" }).href,
    onDuplicateProject,
    onSuccessArchiveProject: () => {
      routes.myEvaluations().replace();
    },
    projectId,
    updateProjectLinkProps: routes.updateProject({ projectId, from: "impacts" }).link,
    createProjectLinkProps: routes.createProject({ siteId: contextData?.relatedSiteId ?? "" }).link,
    documentationLinkProps: routes.readImpactsDoc().link,
  };

  return <ProjectPageHeader {...headerProps} />;
};

export default ProjectPageHeaderContainer;

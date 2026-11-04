import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { routes } from "@/app/router";
import { impactsExportModalOpened } from "@/features/analytics/core/analyticsEvents";
import { eventTracked } from "@/features/analytics/core/eventTracked.action";
import { selectImpactsContextData } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import useDuplicateProject from "@/shared/views/project/useDuplicateProject";

import ProjectPageHeader, { type HeaderProps } from "./ProjectPageHeader";

const ProjectPageHeaderContainer = ({
  projectId,
  ...props
}: { projectId: string } & Partial<HeaderProps>) => {
  const contextData = useAppSelector(selectImpactsContextData);
  const { onDuplicateProject } = useDuplicateProject(projectId, "impacts");
  const dispatch = useAppDispatch();

  const headerProps = {
    ...props,
    projectType: contextData?.projectDevelopmentPlan.type ?? "URBAN_PROJECT",
    projectName: contextData?.projectName ?? "",
    siteName: contextData?.relatedSiteName ?? "",
    isExpressProject: contextData?.isExpressProject ?? false,
    siteFeaturesHref: routes.siteFeatures({ siteId: contextData?.relatedSiteId ?? "" }).href,
    onDuplicateProject,
    onSuccessArchiveProject: () => {
      routes.myEvaluations().replace();
    },
    onExportModalOpened: () => void dispatch(eventTracked(impactsExportModalOpened())),
    projectId,
    siteId: contextData?.relatedSiteId ?? "",
    updateProjectLinkProps: routes.updateProject({ projectId, from: "impacts" }).link,
    createProjectLinkProps: routes.createProject({ siteId: contextData?.relatedSiteId ?? "" }).link,
    documentationLinkProps: routes.readImpactsDoc().link,
  };

  return <ProjectPageHeader {...headerProps} />;
};

export default ProjectPageHeaderContainer;

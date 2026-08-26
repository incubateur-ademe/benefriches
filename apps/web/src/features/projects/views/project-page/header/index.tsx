import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { routes } from "@/app/router";
import { appSettingUpdated, selectAppSettings } from "@/features/app-settings/core/appSettings";
import { selectImpactsContextData } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import useDuplicateProject from "@/shared/views/project/useDuplicateProject";

import ProjectPageHeader from "./ProjectPageHeader";

const ProjectPageHeaderContainer = ({ projectId }: { projectId: string }) => {
  const contextData = useAppSelector(selectImpactsContextData);
  const { onDuplicateProject } = useDuplicateProject(projectId, "impacts");

  const dispatch = useAppDispatch();
  const { useBetaAmenageScoreView } = useAppSelector(selectAppSettings);

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
    isBetaDevelopmentScoreViewActivated: useBetaAmenageScoreView,
    onToggleDevelopmentScoreView: () => {
      dispatch(
        appSettingUpdated({
          field: "useBetaAmenageScoreView",
          value: !useBetaAmenageScoreView,
        }),
      );
    },
    projectId,
    updateProjectLinkProps: routes.updateProject({ projectId, from: "impacts" }).link,
    createProjectLinkProps: routes.createProject({ siteId: contextData?.relatedSiteId ?? "" }).link,
  };

  return <ProjectPageHeader {...headerProps} />;
};

export default ProjectPageHeaderContainer;

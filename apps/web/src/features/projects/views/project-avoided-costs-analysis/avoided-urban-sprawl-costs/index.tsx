import { useEffect } from "react";
import { SiteNature } from "shared";

import { useAppDispatch, useAppSelector } from "@/app/hooks/store.hooks";
import { urbanSprawlImpactsComparisonRequested } from "@/features/projects/application/project-impacts/actions/urbanSprawlImpactsComparisonRequested.action";
import { selectAvoidedUrbanSprawlCostsAnalysisDataView } from "@/features/projects/application/project-impacts/selectors/projectAvoidedCostsAnalysis.selectors";
import { ProjectDevelopmentPlanType } from "@/features/projects/domain/projects.types";

import ProjectAvoidedUrbanSprawlCosts from "./ProjectAvoidedUrbanSprawlCosts";

type Props = {
  projectType: ProjectDevelopmentPlanType;
  siteNature: SiteNature;
  projectId: string;
};

export default function ProjectAvoidedUrbanSprawlCostsContainer({
  projectType,
  siteNature,
  projectId,
}: Props) {
  const dispatch = useAppDispatch();

  const avoidedInactionCostsAnalysisDataView = useAppSelector(
    selectAvoidedUrbanSprawlCostsAnalysisDataView,
  );

  useEffect(() => {
    void dispatch(
      urbanSprawlImpactsComparisonRequested({
        projectId: projectId,
        comparisonSiteNature: siteNature === "FRICHE" ? "AGRICULTURAL_OPERATION" : "FRICHE",
      }),
    );
  }, [dispatch, projectId, siteNature]);

  if (avoidedInactionCostsAnalysisDataView.shouldDisplayOnBoarding) {
    return null;
  }

  return (
    <ProjectAvoidedUrbanSprawlCosts
      projectType={projectType}
      siteNature={siteNature}
      {...avoidedInactionCostsAnalysisDataView}
    />
  );
}

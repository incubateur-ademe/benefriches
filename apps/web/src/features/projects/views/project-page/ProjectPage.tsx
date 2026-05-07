import { Route } from "type-route";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { routes, useRoute } from "@/app/router";
import { selectAppSettings } from "@/features/app-settings/core/appSettings";
import classNames from "@/shared/views/clsx";
import NotFoundScreen from "@/shared/views/components/NotFound/NotFound";

import ProjectBreakEvenLevelTabContainer from "../project-break-even-level";
import ProjectDevelopmentScore from "../project-development-score";
import ProjectImpactsUrbanSprawlImpactsComparisonView from "../project-impacts-urban-sprawl-comparison";
import ProjectSummaryTab from "../project-summary/";
import ProjectFeaturesView from "./features/index";
import ProjectPageHeader from "./header/";
import ProjectPageTabs from "./header/ProjectPageTabs";
import ProjectImpactsView from "./impacts";

type Props = {
  projectId: string;
};

export type ProjectRoute =
  | Route<typeof routes.projectImpactsSummary>
  | Route<typeof routes.projectImpacts>
  | Route<typeof routes.projectFeatures>
  | Route<typeof routes.projectImpactsBreakEvenLevel>
  | Route<typeof routes.urbanSprawlImpactsComparison>
  | Route<typeof routes.projectImpactsDevelopmentScore>;

function ProjectPage({ projectId }: Props) {
  const route = useRoute() as ProjectRoute;
  const { useBetaAmenageScoreView } = useAppSelector(selectAppSettings);

  return (
    <div id="project-impacts-page" className={classNames("h-full")}>
      <div className="mb-8 bg-grey-light dark:bg-grey-dark">
        <div className="py-8">
          <ProjectPageHeader projectId={projectId} />
        </div>
        <ProjectPageTabs useBetaAmenageScoreView={useBetaAmenageScoreView} />
      </div>

      <div className="fr-container pb-14">
        {(() => {
          switch (route.name) {
            case "projectFeatures":
              return <ProjectFeaturesView projectId={projectId} />;
            case "projectImpacts":
              return <ProjectImpactsView projectId={projectId} />;
            case "urbanSprawlImpactsComparison":
              return <ProjectImpactsUrbanSprawlImpactsComparisonView projectId={projectId} />;
            case "projectImpactsBreakEvenLevel":
              return <ProjectBreakEvenLevelTabContainer projectId={projectId} />;
            case "projectImpactsSummary":
              return <ProjectSummaryTab projectId={projectId} />;
            case "projectImpactsDevelopmentScore":
              return useBetaAmenageScoreView ? (
                <ProjectDevelopmentScore projectId={projectId} />
              ) : (
                <NotFoundScreen />
              );
          }
        })()}
      </div>
    </div>
  );
}

export default ProjectPage;

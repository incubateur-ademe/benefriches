import type { Route } from "type-route";

import { type routes, useRoute } from "@/app/router";
import classNames from "@/shared/views/clsx";

import ProjectAvoidedCostsAnalysis from "../project-avoided-costs-analysis";
import ProjectBreakEvenLevelTabContainer from "../project-break-even-level";
import ProjectDevelopmentScore from "../project-development-score";
import ProjectFeaturesView from "../project-features";
import ProjectImpactsView from "../project-impacts";
import ProjectSummaryTab from "../project-summary/";
import ProjectPageHeader from "./header/";
import ProjectPageTabs from "./header/ProjectPageTabs";

type Props = {
  projectId: string;
};

export type ProjectRoute =
  | Route<typeof routes.projectImpactsSummary>
  | Route<typeof routes.projectImpacts>
  | Route<typeof routes.projectFeatures>
  | Route<typeof routes.projectImpactsBreakEvenLevel>
  | Route<typeof routes.projectImpactsDevelopmentScore>
  | Route<typeof routes.projectAvoidedCostsAnalysis>;

function ProjectPage({ projectId }: Props) {
  const route = useRoute() as ProjectRoute;

  return (
    <div id="project-impacts-page" className={classNames("h-full")}>
      <div className="mb-8 bg-grey-light dark:bg-grey-dark">
        <div className="py-8">
          <ProjectPageHeader projectId={projectId} />
        </div>
        <ProjectPageTabs />
      </div>

      <div className="fr-container pb-14">
        {(() => {
          switch (route.name) {
            case "projectFeatures":
              return <ProjectFeaturesView projectId={projectId} />;
            case "projectImpacts":
              return <ProjectImpactsView projectId={projectId} />;
            case "projectImpactsBreakEvenLevel":
              return <ProjectBreakEvenLevelTabContainer projectId={projectId} />;
            case "projectImpactsSummary":
              return <ProjectSummaryTab projectId={projectId} />;
            case "projectImpactsDevelopmentScore":
              return <ProjectDevelopmentScore projectId={projectId} />;
            case "projectAvoidedCostsAnalysis":
              return <ProjectAvoidedCostsAnalysis projectId={projectId} />;
          }
        })()}
      </div>
    </div>
  );
}

export default ProjectPage;

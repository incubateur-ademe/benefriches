import { Route } from "type-route";

import classNames from "@/shared/views/clsx";
import { routes, useRoute } from "@/shared/views/router.ts";

import ProjectFeaturesViewContainer from "./features/index.tsx";
import ProjectPageTabs from "./header/ProjectPageTabs.tsx";
import ProjectPageHeader from "./header/index.tsx";
import ProjectImpactsView from "./impacts";

type Props = {
  projectId: string;
};

export type ProjectRoute =
  | Route<typeof routes.projectImpacts>
  | Route<typeof routes.projectFeatures>
  | Route<typeof routes.urbanSprawlImpactsComparison>;

function ProjectPage({ projectId }: Props) {
  const route = useRoute() as ProjectRoute;

  return (
    <div id="project-impacts-page" className={classNames("h-full")}>
      <div className="mb-8 bg-grey-light dark:bg-grey-dark">
        <div className="py-8">
          <ProjectPageHeader />
        </div>
        <ProjectPageTabs />
      </div>

      <div className="fr-container pb-14">
        {(() => {
          switch (route.name) {
            case "projectFeatures":
              return <ProjectFeaturesViewContainer projectId={projectId} />;
            case "projectImpacts":
              return <ProjectImpactsView projectId={projectId} />;
          }
        })()}
      </div>
    </div>
  );
}

export default ProjectPage;

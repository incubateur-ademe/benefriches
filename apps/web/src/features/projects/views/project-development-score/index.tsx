import type { Route } from "type-route";

import { useAppSelector } from "@/app/hooks/store.hooks";
import { routes, useRoute } from "@/app/router";

import { selectDevelopmentScoreDataView } from "../../application/project-impacts/selectors/projectDevelopmentScore.selectors";
import ProjectDevelopmentScore from "./ProjectDevelopmentScorePage";

type Props = {
  projectId: string;
};

export default function ProjectDevelopmentScoreContainer({ projectId }: Props) {
  const developmentScoreDataView = useAppSelector(selectDevelopmentScoreDataView);

  const route = useRoute() as Route<typeof routes.projectImpactsDevelopmentScore>;

  if (!developmentScoreDataView) {
    return null;
  }
  return (
    <ProjectDevelopmentScore
      projectId={projectId}
      routeParamsDetails={route.params.details}
      getUpdateRouteDetailsFn={(details?: string) =>
        routes.projectImpactsDevelopmentScore({ ...route.params, details })
      }
      {...developmentScoreDataView}
    />
  );
}

import { useEffect } from "react";
import { Route } from "type-route";

import { routes } from "@/shared/views/router";

import ProjectImpactsOnboardingPage from "./ProjectImpactsOnboardingPage";
import { DEFAULT_STEP } from "./steps";

type Props = {
  projectId: string;
  route: Route<typeof routes.projectImpactsOnboarding>;
};

function ProjectImpactsOnboardingPageContainer({ projectId, route }: Props) {
  useEffect(() => {
    if (!route.params.etape)
      routes
        .projectImpactsOnboarding({
          projectId,
          etape: DEFAULT_STEP,
          canSkipIntroduction: route.params.canSkipIntroduction,
        })
        .replace();
  }, [route, projectId]);

  return (
    <ProjectImpactsOnboardingPage
      routeStep={route.params.etape}
      onNextToStep={(step: string) => {
        routes
          .projectImpactsOnboarding({
            projectId,
            etape: step,
            canSkipIntroduction: route.params.canSkipIntroduction,
          })
          .push();
      }}
      onBackToStep={(step: string) => {
        routes
          .projectImpactsOnboarding({
            projectId,
            etape: step,
            canSkipIntroduction: route.params.canSkipIntroduction,
          })
          .replace();
      }}
      onFinalNext={() => {
        routes.projectImpacts({ projectId }).push();
      }}
      canSkipOnboarding={route.params.canSkipIntroduction === true}
    />
  );
}

export default ProjectImpactsOnboardingPageContainer;

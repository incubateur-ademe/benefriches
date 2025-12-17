import { useEffect } from "react";
import { Route } from "type-route";

import { impactsOnboardingCompleted } from "@/features/projects/application/project-impacts/impactsOnboardingSkip.actions";
import { selectCanSkipImpactsOnboarding } from "@/features/projects/application/project-impacts/impactsOnboardingSkip.selectors";
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";
import { routes } from "@/shared/views/router";

import ProjectImpactsOnboardingPage from "./ProjectImpactsOnboardingPage";
import { DEFAULT_STEP } from "./steps";

type Props = {
  projectId: string;
  route: Route<typeof routes.projectImpactsOnboarding>;
};

function ProjectImpactsOnboardingPageContainer({ projectId, route }: Props) {
  const dispatch = useAppDispatch();
  const canSkipOnboarding = useAppSelector(selectCanSkipImpactsOnboarding);

  useEffect(() => {
    if (!route.params.etape)
      routes
        .projectImpactsOnboarding({
          projectId,
          etape: DEFAULT_STEP,
        })
        .replace();
  }, [route, projectId]);

  const handleOnboardingExit = () => {
    dispatch(impactsOnboardingCompleted());
    routes.projectImpacts({ projectId }).push();
  };

  return (
    <ProjectImpactsOnboardingPage
      routeStep={route.params.etape}
      onNextToStep={(step: string) => {
        routes
          .projectImpactsOnboarding({
            projectId,
            etape: step,
          })
          .push();
      }}
      onBackToStep={(step: string) => {
        routes
          .projectImpactsOnboarding({
            projectId,
            etape: step,
          })
          .replace();
      }}
      onFinalNext={handleOnboardingExit}
      canSkipOnboarding={canSkipOnboarding}
    />
  );
}

export default ProjectImpactsOnboardingPageContainer;

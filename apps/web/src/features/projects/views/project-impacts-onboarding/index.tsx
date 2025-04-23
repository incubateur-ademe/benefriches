import { Route } from "type-route";

import { routes } from "@/shared/views/router";

import ProjectImpactsOnboardingPage from "./ProjectImpactsOnboardingPage";

type Props = {
  projectId: string;
  route: Route<typeof routes.projectImpactsOnboarding>;
};

function ProjectImpactsOnboardingPageContainer({ projectId, route }: Props) {
  return (
    <ProjectImpactsOnboardingPage
      routeStep={route.params.etape}
      onNextToStep={(step: string) => {
        routes.projectImpactsOnboarding({ projectId, etape: step }).push();
      }}
      onBackToStep={(step: string) => {
        routes.projectImpactsOnboarding({ projectId, etape: step }).replace();
      }}
      onFinalNext={() => {
        routes.projectImpacts({ projectId }).push();
      }}
    />
  );
}

export default ProjectImpactsOnboardingPageContainer;

import { Route } from "type-route";

import ProjectImpactsOnboardingPage from "@/features/projects/views/project-impacts-onboarding/ProjectImpactsOnboardingPage";
import { routes } from "@/shared/views/router";

type Props = {
  projectId: string;
  route: Route<typeof routes.demoProjectImpactsOnboarding>;
};

function DemoProjectImpactsOnboarding({ projectId, route }: Props) {
  return (
    <ProjectImpactsOnboardingPage
      onFinalNext={() => {
        routes.demoProjectImpacts({ projectId }).push();
      }}
      routeStep={route.params.etape}
      onNextToStep={(step: string) => {
        routes.demoProjectImpactsOnboarding({ projectId, etape: step }).push();
      }}
      onBackToStep={(step: string) => {
        routes.demoProjectImpactsOnboarding({ projectId, etape: step }).replace();
      }}
    />
  );
}

export default DemoProjectImpactsOnboarding;

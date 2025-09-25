import { lazy, Suspense } from "react";
import { createGroup } from "type-route";

import NotFoundScreen from "@/shared/views/components/NotFound/NotFound";
import RequireAuthenticatedUser from "@/shared/views/components/RequireAuthenticatedUser/RequireAuthenticatedUser";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import HeaderFooterLayout from "@/shared/views/layout/HeaderFooterLayout/HeaderFooterLayout";
import SidebarContainerLayout from "@/shared/views/layout/SidebarLayout/SidebarContainerLayout";
import { routes, useRoute } from "@/shared/views/router";

/* Lazy-loaded pages */
const CreateProjectPage = lazy(
  () => import("@/features/create-project/views/ProjectCreationWizard"),
);
const CreateSiteFoncierPage = lazy(() => import("@/features/create-site/views/SiteCreationWizard"));
const OnBoardingIntroductionPages = lazy(
  () => import("@/features/onboarding/views/OnBoardingIntroductionPages"),
);
const MyProjectsPage = lazy(() => import("@/features/projects/views/my-projects-page"));
const ProjectImpactsPage = lazy(() => import("@/features/projects/views/project-page"));
const UrbanSprawlImpactsComparisonPage = lazy(
  () => import("@/features/projects/views/project-impacts-urban-sprawl-comparison"),
);
const EvaluateMutabilityPage = lazy(
  () => import("@/features/friche-mutability/views/EvaluateMutabilityPage"),
);
const MutabilityResultsPage = lazy(
  () => import("@/features/friche-mutability/views/MutabilityResultsPage"),
);
const SiteFeaturesPage = lazy(() => import("@/features/site-features/views"));
const ProjectImpactsOnboardingPage = lazy(
  () => import("@/features/projects/views/project-impacts-onboarding"),
);

const formsLayoutGroup = createGroup([routes.createSiteFoncier, routes.createProject]);
const onBoardingGroup = createGroup([
  routes.onBoardingIntroductionHow,
  routes.onBoardingIntroductionWhy,
]);

function FeaturesApp() {
  const route = useRoute();

  if (formsLayoutGroup.has(route)) {
    return (
      <SidebarContainerLayout>
        <Suspense fallback={<LoadingSpinner />}>
          <RequireAuthenticatedUser>
            {(() => {
              switch (route.name) {
                case routes.createSiteFoncier.name:
                  return <CreateSiteFoncierPage />;
                case routes.createProject.name:
                  return <CreateProjectPage route={route} />;
              }
            })()}
          </RequireAuthenticatedUser>
        </Suspense>
      </SidebarContainerLayout>
    );
  }

  if (onBoardingGroup.has(route)) {
    return (
      <HeaderFooterLayout>
        <Suspense fallback={<LoadingSpinner />}>
          <RequireAuthenticatedUser>
            <OnBoardingIntroductionPages route={route} />
          </RequireAuthenticatedUser>
        </Suspense>
      </HeaderFooterLayout>
    );
  }

  return (
    <HeaderFooterLayout>
      <RequireAuthenticatedUser>
        <Suspense fallback={<LoadingSpinner />}>
          {(() => {
            switch (route.name) {
              // protected pages
              case routes.myProjects.name:
                return <MyProjectsPage />;
              case routes.projectImpacts.name:
                return <ProjectImpactsPage projectId={route.params.projectId} />;

              case routes.projectImpactsOnboarding.name:
                return (
                  <ProjectImpactsOnboardingPage projectId={route.params.projectId} route={route} />
                );
              case routes.urbanSprawlImpactsComparison.name:
                return <UrbanSprawlImpactsComparisonPage route={route} />;
              case routes.siteFeatures.name:
                return <SiteFeaturesPage siteId={route.params.siteId} />;
              case routes.fricheMutability.name:
                return <EvaluateMutabilityPage />;
              case routes.fricheMutabilityResults.name:
                return <MutabilityResultsPage />;
              // 404
              default:
                return <NotFoundScreen />;
            }
          })()}
        </Suspense>
      </RequireAuthenticatedUser>
    </HeaderFooterLayout>
  );
}

export default FeaturesApp;

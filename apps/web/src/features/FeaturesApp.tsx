import { lazy, Suspense } from "react";
import { createGroup } from "type-route";

import NotFoundScreen from "@/shared/views/components/NotFound/NotFound";
import RequireAuthenticatedUser from "@/shared/views/components/RequireAuthenticatedUser/RequireAuthenticatedUser";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import HeaderFooterLayout from "@/shared/views/layout/HeaderFooterLayout/HeaderFooterLayout";
import SidebarContainerLayout from "@/shared/views/layout/SidebarLayout/SidebarContainerLayout";
import { routes, useRoute } from "@/shared/views/router";

import OnBoardingIntroductionHow from "./onboarding/views/pages/how-it-works/HowItWorksPage";
import OnboardingWhenNotToUsePage from "./onboarding/views/pages/when-not-to-use/OnboardingWhenNotToUsePage";
import OnboardingWhenToUsePage from "./onboarding/views/pages/when-to-use/OnboardingWhenToUsePage";
import UpdateProjectPage from "./update-project/views";

/* Lazy-loaded pages */
const CreateProjectPage = lazy(
  () => import("@/features/create-project/views/ProjectCreationWizard"),
);
const CreateSiteFoncierPage = lazy(() => import("@/features/create-site/views/SiteCreationWizard"));
const MyEvaluationsPage = lazy(() => import("@/features/my-evaluations/views/my-evaluations-page"));
const ProjectImpactsPage = lazy(() => import("@/features/projects/views/project-page"));
const UrbanSprawlImpactsComparisonPage = lazy(
  () => import("@/features/projects/views/project-impacts-urban-sprawl-comparison"),
);
const EvaluateReconversionCompatibilityPage = lazy(
  () =>
    import(
      "@/features/reconversion-compatibility/views/evaluation/EvaluateReconversionCompatibilityPage"
    ),
);
const ReconversionCompatibilityResultsPage = lazy(
  () => import("@/features/reconversion-compatibility/views/results"),
);
const SiteFeaturesPage = lazy(() => import("@/features/site-features/views"));
const ProjectImpactsOnboardingPage = lazy(
  () => import("@/features/projects/views/project-impacts-onboarding"),
);
const ProjectCreationOnboardingPage = lazy(
  () =>
    import(
      "@/features/create-project/views/onboarding-from-compatibility-evaluation/ProjectCreationFromCompatibilityEvaluationOnboarding"
    ),
);

const formsLayoutGroup = createGroup([
  routes.createSite,
  routes.createProject,
  routes.updateProject,
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
                case routes.createSite.name:
                  return <CreateSiteFoncierPage />;
                case routes.createProject.name:
                  return <CreateProjectPage route={route} />;
                case routes.updateProject.name:
                  return <UpdateProjectPage route={route} />;
              }
            })()}
          </RequireAuthenticatedUser>
        </Suspense>
      </SidebarContainerLayout>
    );
  }

  return (
    <HeaderFooterLayout>
      <RequireAuthenticatedUser>
        <Suspense fallback={<LoadingSpinner />}>
          {(() => {
            switch (route.name) {
              // protected pages
              case routes.onBoardingWhenToUse.name:
                return <OnboardingWhenToUsePage variant={route.params.fonctionnalite} />;
              case routes.onBoardingWhenNotToUse.name:
                return <OnboardingWhenNotToUsePage variant={route.params.fonctionnalite} />;
              case routes.onBoardingIntroductionHow.name:
                return <OnBoardingIntroductionHow variant={route.params.fonctionnalite} />;
              case routes.projectCreationOnboarding.name:
                return <ProjectCreationOnboardingPage route={route} />;
              case routes.myEvaluations.name:
                return <MyEvaluationsPage />;
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
              case routes.evaluateReconversionCompatibility.name:
                return <EvaluateReconversionCompatibilityPage />;
              case routes.reconversionCompatibilityResults.name:
                return <ReconversionCompatibilityResultsPage />;
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

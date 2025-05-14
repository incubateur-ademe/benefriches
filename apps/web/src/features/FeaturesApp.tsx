import { lazy, Suspense, useEffect } from "react";
import { createGroup } from "type-route";

import { initCurrentUser } from "@/features/onboarding/core/initCurrentUser.action";
import MatomoContainer from "@/shared/views/MatomoContainer";
import NotFoundScreen from "@/shared/views/components/NotFound/NotFound";
import RequireAuthenticatedUser from "@/shared/views/components/RequireAuthenticatedUser/RequireAuthenticatedUser";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { BENEFRICHES_ENV } from "@/shared/views/envVars";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import HeaderFooterLayout from "@/shared/views/layout/HeaderFooterLayout/HeaderFooterLayout";
import SidebarContainerLayout from "@/shared/views/layout/SidebarLayout/SidebarContainerLayout";
import { routes, useRoute } from "@/shared/views/router";

/* Lazy-loaded pages */
const CreateUserPage = lazy(() => import("@/features/onboarding/views"));
const CreateProjectPage = lazy(
  () => import("@/features/create-project/views/ProjectCreationWizard"),
);
const CreateSiteFoncierPage = lazy(() => import("@/features/create-site/views/SiteCreationWizard"));
const LoginPage = lazy(() => import("@/features/login"));
const OnBoardingIdentityPage = lazy(
  () => import("@/features/onboarding/views/pages/identity/OnBoardingIdentityPage"),
);
const OnBoardingIntroductionPages = lazy(
  () => import("@/features/onboarding/views/OnBoardingIntroductionPages"),
);
const MyProjectsPage = lazy(() => import("@/features/projects/views/my-projects-page"));
const ProjectImpactsPage = lazy(() => import("@/features/projects/views/project-page"));
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
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(initCurrentUser());
  }, [dispatch]);

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
            {BENEFRICHES_ENV.matomoTrackingEnabled && (
              <MatomoContainer
                siteId={BENEFRICHES_ENV.matomoSiteId}
                matomoUrl={BENEFRICHES_ENV.matomoUrl}
              />
            )}
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
      <Suspense fallback={<LoadingSpinner />}>
        {(() => {
          switch (route.name) {
            case routes.onBoardingIdentity.name:
              return <OnBoardingIdentityPage />;
            case routes.login.name:
              return <LoginPage />;
            // protected pages
            case routes.createUser.name:
              return (
                <RequireAuthenticatedUser>
                  <CreateUserPage />
                </RequireAuthenticatedUser>
              );
            case routes.myProjects.name:
              return (
                <RequireAuthenticatedUser>
                  <MyProjectsPage />
                </RequireAuthenticatedUser>
              );
            case routes.projectImpacts.name:
              return (
                <RequireAuthenticatedUser>
                  <ProjectImpactsPage projectId={route.params.projectId} />
                </RequireAuthenticatedUser>
              );

            case routes.projectImpactsOnboarding.name:
              return (
                <RequireAuthenticatedUser>
                  <ProjectImpactsOnboardingPage projectId={route.params.projectId} route={route} />
                </RequireAuthenticatedUser>
              );
            case routes.siteFeatures.name:
              return (
                <RequireAuthenticatedUser>
                  <SiteFeaturesPage siteId={route.params.siteId} />
                </RequireAuthenticatedUser>
              );
            // 404
            default:
              return <NotFoundScreen />;
          }
        })()}
      </Suspense>
    </HeaderFooterLayout>
  );
}

export default FeaturesApp;

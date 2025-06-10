import { lazy, Suspense, useEffect } from "react";
import { createGroup } from "type-route";

import { initCurrentUser } from "@/features/onboarding/core/initCurrentUser.action";
import NotFoundScreen from "@/shared/views/components/NotFound/NotFound";
import RequireRegisteredUser from "@/shared/views/components/RequireRegisteredUser/RequireRegisteredUser";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
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
          <RequireRegisteredUser>
            {(() => {
              switch (route.name) {
                case routes.createSiteFoncier.name:
                  return <CreateSiteFoncierPage />;
                case routes.createProject.name:
                  return <CreateProjectPage route={route} />;
              }
            })()}
          </RequireRegisteredUser>
        </Suspense>
      </SidebarContainerLayout>
    );
  }

  if (onBoardingGroup.has(route)) {
    return (
      <HeaderFooterLayout>
        <Suspense fallback={<LoadingSpinner />}>
          <RequireRegisteredUser>
            <OnBoardingIntroductionPages route={route} />
          </RequireRegisteredUser>
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
                <RequireRegisteredUser>
                  <CreateUserPage />
                </RequireRegisteredUser>
              );
            case routes.myProjects.name:
              return (
                <RequireRegisteredUser>
                  <MyProjectsPage />
                </RequireRegisteredUser>
              );
            case routes.projectImpacts.name:
              return (
                <RequireRegisteredUser>
                  <ProjectImpactsPage projectId={route.params.projectId} />
                </RequireRegisteredUser>
              );

            case routes.projectImpactsOnboarding.name:
              return (
                <RequireRegisteredUser>
                  <ProjectImpactsOnboardingPage projectId={route.params.projectId} route={route} />
                </RequireRegisteredUser>
              );
            case routes.siteFeatures.name:
              return (
                <RequireRegisteredUser>
                  <SiteFeaturesPage siteId={route.params.siteId} />
                </RequireRegisteredUser>
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

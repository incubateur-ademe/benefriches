import { fr } from "@codegouvfr/react-dsfr";
import { lazy, Suspense, useEffect } from "react";

import ProjectImpactsOnboardingPage from "@/features/projects/views/project-impacts-onboarding";
import { initCurrentUser } from "@/features/users/application/initCurrentUser.action";
import RequireRegisteredUser from "@/shared/views/components/RequireRegisteredUser/RequireRegisteredUser";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import HeaderFooterLayout from "@/shared/views/layout/HeaderFooterLayout/HeaderFooterLayout";
import SidebarContainerLayout from "@/shared/views/layout/SidebarLayout/SidebarContainerLayout";

import { trackPageView } from "../application/analytics";
import { BENEFRICHES_ENV } from "../application/envVars";
import MatomoContainer from "./MatomoContainer";
import { routes, useRoute } from "./router";

/* Lazy-loaded pages */
const CreateUserPage = lazy(() => import("@/features/users/views"));
const AccessibilitePage = lazy(() => import("./pages/AccessibilitePage"));
const BudgetPage = lazy(() => import("./pages/BudgetPage"));
const HomePage = lazy(() => import("./pages/home/HomePage"));
const MentionsLegalesPage = lazy(() => import("./pages/MentionsLegalesPage"));
const PolitiqueConfidentialitePage = lazy(() => import("./pages/PolitiqueConfidentialitePage"));
const StatsPage = lazy(() => import("./pages/StatsPage"));
const CreateProjectPage = lazy(
  () => import("@/features/create-project/views/ProjectCreationWizard"),
);
const CreateSiteFoncierPage = lazy(() => import("@/features/create-site/views/SiteCreationWizard"));
const LoginPage = lazy(() => import("@/features/login"));
const OnBoardingIdentityPage = lazy(
  () => import("@/features/onboarding/identity/OnBoardingIdentityPage"),
);
const OnBoardingIntroductionWhyBenefriches = lazy(
  () => import("@/features/onboarding/why-benefriches/WhyBenefrichesPage"),
);
const OnBoardingIntroductionHowItWorks = lazy(
  () => import("@/features/onboarding/how-it-works/HowItWorksPage"),
);
const MyProjectsPage = lazy(() => import("@/features/projects/views/my-projects-page"));
const ProjectImpactsPage = lazy(() => import("@/features/projects/views/project-page"));
const SiteFeaturesPage = lazy(() => import("@/features/site-features/views"));

function App() {
  const route = useRoute();
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(initCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    trackPageView(route.href);
  }, [route]);

  const useSidebarContainer =
    route.name === routes.createSiteFoncier.name || route.name === routes.createProject.name;
  const Layout = useSidebarContainer ? SidebarContainerLayout : HeaderFooterLayout;

  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        {(() => {
          switch (route.name) {
            case routes.home.name:
              return <HomePage />;
            case routes.onBoardingIdentity.name:
              return <OnBoardingIdentityPage />;
            case routes.login.name:
              return <LoginPage />;
            case routes.budget.name:
              return <BudgetPage />;
            case routes.stats.name:
              return <StatsPage />;
            case routes.mentionsLegales.name:
              return <MentionsLegalesPage />;
            case routes.accessibilite.name:
              return <AccessibilitePage />;
            case routes.politiqueConfidentialite.name:
              return <PolitiqueConfidentialitePage />;
            // protected pages
            case routes.onBoardingIntroductionWhy.name:
              return (
                <RequireRegisteredUser>
                  <OnBoardingIntroductionWhyBenefriches />
                </RequireRegisteredUser>
              );
            case routes.onBoardingIntroductionHow.name:
              return (
                <RequireRegisteredUser>
                  <OnBoardingIntroductionHowItWorks />
                </RequireRegisteredUser>
              );
            case routes.createUser.name:
              return (
                <RequireRegisteredUser>
                  <CreateUserPage />
                </RequireRegisteredUser>
              );
            case routes.createSiteFoncier.name:
              return (
                <RequireRegisteredUser>
                  <CreateSiteFoncierPage />
                </RequireRegisteredUser>
              );
            case routes.myProjects.name:
              return (
                <RequireRegisteredUser>
                  <MyProjectsPage />
                </RequireRegisteredUser>
              );
            case routes.createProject.name:
              return (
                <RequireRegisteredUser>
                  <CreateProjectPage route={route} />
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
                  <ProjectImpactsOnboardingPage projectId={route.params.projectId} />
                </RequireRegisteredUser>
              );
            case routes.siteFeatures.name:
              return <SiteFeaturesPage siteId={route.params.siteId} />;
            // 404
            default:
              return (
                <section className={fr.cx("fr-container", "fr-py-4w")}>Page non trouvée</section>
              );
          }
        })()}
      </Suspense>
      {BENEFRICHES_ENV.matomoTrackingEnabled && (
        <MatomoContainer
          siteId={BENEFRICHES_ENV.matomoSiteId}
          matomoUrl={BENEFRICHES_ENV.matomoUrl}
        />
      )}
    </Layout>
  );
}

export default App;

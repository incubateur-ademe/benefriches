import { lazy, Suspense, useEffect } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { trackPageView } from "../application/analytics";
import { BENEFRICHES_ENV } from "../application/envVars";
import MatomoContainer from "./MatomoContainer";
import { routes, useRoute } from "./router";

import { initCurrentUser } from "@/features/users/application/initCurrentUser.action";
import RequireRegisteredUser from "@/shared/views/components/RequireRegisteredUser/RequireRegisteredUser";
import LoadingSpinner from "@/shared/views/components/Spinner/LoadingSpinner";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import HeaderFooterLayout from "@/shared/views/layout/HeaderFooterLayout/HeaderFooterLayout";

/* Lazy-loaded pages */
const CreateUserPage = lazy(() => import("@/features/users/views"));
const AccessibilitePage = lazy(() => import("./pages/AccessibilitePage"));
const BudgetPage = lazy(() => import("./pages/BudgetPage"));
const HomePage = lazy(() => import("./pages/home/HomePage"));
const MentionsLegalesPage = lazy(() => import("./pages/MentionsLegalesPage"));
const PolitiqueConfidentialitePage = lazy(() => import("./pages/PolitiqueConfidentialitePage"));
const CreateProjectIntroductionPage = lazy(
  () => import("@/features/create-project/views/introduction"),
);
const StatsPage = lazy(() => import("./pages/StatsPage"));
const CreateProjectPage = lazy(
  () => import("@/features/create-project/views/ProjectCreationWizard"),
);
const CreateSiteIntroductionPage = lazy(
  () => import("@/features/create-site/views/introduction/CreateSiteIntroductionPage"),
);
const CreateSiteFoncierPage = lazy(() => import("@/features/create-site/views/SiteCreationWizard"));
const LoginPage = lazy(() => import("@/features/login"));
const OnboardingPage = lazy(() => import("@/features/onboarding"));
const MyProjectsPage = lazy(() => import("@/features/projects/views/my-projects-page"));
const ProjectImpactsPage = lazy(() => import("@/features/projects/views/project-impacts-page"));
const ProjectsImpactsComparisonPage = lazy(
  () => import("@/features/projects/views/projects-impacts-comparison"),
);
const ProjectsComparisonSelectionPage = lazy(
  () => import("@/features/projects/views/select-projects-comparison-page"),
);

function App() {
  const route = useRoute();
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(initCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    trackPageView(route.href);
  }, [route]);

  return (
    <HeaderFooterLayout>
      <Suspense fallback={<LoadingSpinner />}>
        {route.name === routes.home.name && <HomePage />}
        {route.name === routes.onboarding.name && <OnboardingPage />}
        {route.name === routes.login.name && <LoginPage />}
        {route.name === routes.budget.name && <BudgetPage />}
        {route.name === routes.stats.name && <StatsPage />}
        {route.name === routes.mentionsLegales.name && <MentionsLegalesPage />}
        {route.name === routes.accessibilite.name && <AccessibilitePage />}
        {route.name === routes.politiqueConfidentialite.name && <PolitiqueConfidentialitePage />}
        {/* protected pages */}
        {route.name === routes.createUser.name && (
          <RequireRegisteredUser>
            <CreateUserPage />
          </RequireRegisteredUser>
        )}
        {route.name === routes.createSiteFoncierIntro.name && (
          <RequireRegisteredUser>
            <CreateSiteIntroductionPage />
          </RequireRegisteredUser>
        )}
        {route.name === routes.createSiteFoncier.name && (
          <RequireRegisteredUser>
            <CreateSiteFoncierPage />
          </RequireRegisteredUser>
        )}
        {route.name === routes.myProjects.name && (
          <RequireRegisteredUser>
            <MyProjectsPage />
          </RequireRegisteredUser>
        )}
        {route.name === routes.createProjectIntro.name && (
          <RequireRegisteredUser>
            <CreateProjectIntroductionPage route={route} />
          </RequireRegisteredUser>
        )}
        {route.name === routes.createProject.name && (
          <RequireRegisteredUser>
            <CreateProjectPage />
          </RequireRegisteredUser>
        )}
        {route.name === routes.compareProjects.name && (
          <RequireRegisteredUser>
            <ProjectsImpactsComparisonPage route={route} />
          </RequireRegisteredUser>
        )}
        {route.name === routes.selectProjectToCompare.name && (
          <RequireRegisteredUser>
            <ProjectsComparisonSelectionPage route={route} />
          </RequireRegisteredUser>
        )}
        {route.name === routes.projectImpacts.name && (
          <RequireRegisteredUser>
            <ProjectImpactsPage projectId={route.params.projectId} />
          </RequireRegisteredUser>
        )}
        {/* 404 */}
        {route.name === false && (
          <section className={fr.cx("fr-container", "fr-py-4w")}>Page non trouvée</section>
        )}
      </Suspense>
      {BENEFRICHES_ENV.matomoTrackingEnabled && (
        <MatomoContainer
          siteId={BENEFRICHES_ENV.matomoSiteId}
          matomoUrl={BENEFRICHES_ENV.matomoUrl}
        />
      )}
    </HeaderFooterLayout>
  );
}

export default App;

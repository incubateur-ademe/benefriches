import { useEffect } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { BENEFRICHES_ENV } from "../application/envVars";
import AccessibilitePage from "./pages/AccessibilitePage";
import BudgetPage from "./pages/BudgetPage";
import HomePage from "./pages/home/HomePage";
import MentionsLegalesPage from "./pages/MentionsLegalesPage";
import PolitiqueConfidentialitePage from "./pages/PolitiqueConfidentialitePage";
import StatsPage from "./pages/StatsPage";
import MatomoContainer from "./MatomoContainer";
import { routes, useRoute } from "./router";

import CreateProjectIntroductionPage from "@/features/create-project/views/introduction";
import CreateProjectPage from "@/features/create-project/views/ProjectCreationWizard";
import CreateSiteIntroductionPage from "@/features/create-site/views/introduction/CreateSiteIntroductionPage";
import CreateSiteFoncierPage from "@/features/create-site/views/SiteCreationWizard";
import LoginPage from "@/features/login";
import OnboardingPage from "@/features/onboarding";
import MyProjectsPage from "@/features/projects/views/my-projects-page";
import ProjectImpactsPage from "@/features/projects/views/project-impacts-page";
import ProjectsImpactsComparisonPage from "@/features/projects/views/projects-impacts-comparison";
import ProjectsComparisonSelectionPage from "@/features/projects/views/select-projects-comparison-page";
import { initCurrentUser } from "@/features/users/application/initCurrentUser.action";
import CreateUserPage from "@/features/users/views";
import RequireRegisteredUser from "@/shared/views/components/RequireRegisteredUser/RequireRegisteredUser";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import HeaderFooterLayout from "@/shared/views/layout/HeaderFooterLayout/HeaderFooterLayout";

function App() {
  const route = useRoute();
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(initCurrentUser());
  }, [dispatch]);

  return (
    <HeaderFooterLayout>
      <>
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
      </>
      {BENEFRICHES_ENV.matomoTrackingEnabled && (
        <MatomoContainer containerUrl={BENEFRICHES_ENV.matomoContainerUrl} />
      )}
    </HeaderFooterLayout>
  );
}

export default App;

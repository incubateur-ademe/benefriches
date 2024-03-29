import { useEffect } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import AccessibilitePage from "./pages/AccessibilitePage";
import BudgetPage from "./pages/BudgetPage";
import HomePage from "./pages/home/HomePage";
import MentionsLegalesPage from "./pages/MentionsLegalesPage";
import PolitiqueConfidentialitePage from "./pages/PolitiqueConfidentialitePage";
import StatsPage from "./pages/StatsPage";
import { routes, useRoute } from "./router";

import CreateProjectIntroductionPage from "@/features/create-project/views/introduction";
import CreateProjectPage from "@/features/create-project/views/ProjectCreationWizard";
import CreateSiteIntroductionPage from "@/features/create-site/views/introduction/CreateSiteIntroductionPage";
import CreateSiteFoncierPage from "@/features/create-site/views/SiteCreationWizard";
import LoginPage from "@/features/login";
import MyProjectsPage from "@/features/projects/views/my-projects-page";
import ProjectImpactsPage from "@/features/projects/views/project-impacts-page";
import ProjectsImpactsComparisonPage from "@/features/projects/views/projects-impacts-comparison";
import ProjectsComparisonSelectionPage from "@/features/projects/views/select-projects-comparison-page";
import { initCurrentUserAction } from "@/features/users/application/initCurrentUser.action";
import CreateUserPage from "@/features/users/views";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import HeaderFooterLayout from "@/shared/views/layout/HeaderFooterLayout/HeaderFooterLayout";

function App() {
  const route = useRoute();
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(initCurrentUserAction());
  }, [dispatch]);

  return (
    <HeaderFooterLayout>
      <main>
        {route.name === routes.home.name && <HomePage />}
        {route.name === routes.login.name && <LoginPage />}
        {route.name === routes.createUser.name && <CreateUserPage />}
        {route.name === routes.createSiteFoncierIntro.name && <CreateSiteIntroductionPage />}
        {route.name === routes.createSiteFoncier.name && <CreateSiteFoncierPage />}
        {route.name === routes.myProjects.name && <MyProjectsPage />}
        {route.name === routes.createProjectIntro.name && (
          <CreateProjectIntroductionPage route={route} />
        )}
        {route.name === routes.createProject.name && <CreateProjectPage />}
        {route.name === routes.compareProjects.name && (
          <ProjectsImpactsComparisonPage route={route} />
        )}
        {route.name === routes.selectProjectToCompare.name && (
          <ProjectsComparisonSelectionPage route={route} />
        )}
        {route.name === routes.projectImpacts.name && (
          <ProjectImpactsPage projectId={route.params.projectId} />
        )}
        {route.name === routes.budget.name && <BudgetPage />}
        {route.name === routes.stats.name && <StatsPage />}
        {route.name === routes.mentionsLegales.name && <MentionsLegalesPage />}
        {route.name === routes.accessibilite.name && <AccessibilitePage />}
        {route.name === routes.politiqueConfidentialite.name && <PolitiqueConfidentialitePage />}
        {route.name === false && (
          <section className={fr.cx("fr-container", "fr-py-4w")}>Page non trouvée</section>
        )}
      </main>
    </HeaderFooterLayout>
  );
}

export default App;

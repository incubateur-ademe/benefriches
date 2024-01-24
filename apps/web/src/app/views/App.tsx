import { fr } from "@codegouvfr/react-dsfr";
import BudgetPage from "./pages/BudgetPage";
import HomePage from "./pages/HomePage";
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
import CreateUserPage from "@/features/users/views";
import HeaderFooterLayout from "@/shared/views/layout/HeaderFooterLayout/HeaderFooterLayout";

function App() {
  const route = useRoute();

  return (
    <HeaderFooterLayout>
      <main className={fr.cx("fr-container", "fr-py-4w")}>
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
        {route.name === false && <>Page non trouvée</>}
      </main>
    </HeaderFooterLayout>
  );
}

export default App;

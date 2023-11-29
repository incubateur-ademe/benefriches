import { fr } from "@codegouvfr/react-dsfr";
import CreateProjectIntroductionPage from "./features/create-project/views/introduction";
import CreateProjectPage from "./features/create-project/views/ProjectCreationWizard";
import SiteCreationDocumentsPage from "./features/create-site/views/documents";
import CreateSiteFoncierPage from "./features/create-site/views/SiteCreationWizard";
import LoginPage from "./features/login";
import OnboardingPage from "./features/onboarding/views";
import MyProjectsPage from "./features/projects/views/my-projects-page";
import ProjectImpactsPage from "./features/projects/views/project-impacts-page/ProjectImpactsPage";
import ProjectsImpactsComparisonPage from "./features/projects/views/projects-impacts-comparison/ProjectsImpactsComparisonPage";
import ProjectsComparisonSelectionPage from "./features/projects/views/select-projects-comparison-page";
import SiteFoncierDetailsPage from "./features/site-details/views";
import SitesFonciersListPage from "./features/site-list/views";
import CreateUserPage from "./features/users/views";
import HeaderFooterLayout from "./shared/views/layout/HeaderFooterLayout/HeaderFooterLayout";
import { routes, useRoute } from "./router";

function App() {
  const route = useRoute();

  return (
    <HeaderFooterLayout>
      <main className={fr.cx("fr-container", "fr-py-10w")}>
        {route.name === routes.login.name && <LoginPage />}
        {route.name === routes.createUser.name && <CreateUserPage />}
        {route.name === routes.onboarding.name && <OnboardingPage />}
        {route.name === routes.mesSitesFonciers.name && (
          <SitesFonciersListPage />
        )}
        {route.name === routes.siteFoncierDetails.name && (
          <SiteFoncierDetailsPage
            siteFoncierName={route.params.siteFoncierName}
          />
        )}
        {route.name === routes.createSiteFoncier.name && (
          <CreateSiteFoncierPage />
        )}
        {route.name === routes.createSiteFoncierDocuments.name && (
          <SiteCreationDocumentsPage />
        )}
        {route.name === routes.myProjects.name && <MyProjectsPage />}
        {route.name === routes.createProjectIntro.name && (
          <CreateProjectIntroductionPage route={route} />
        )}
        {route.name === routes.createProject.name && <CreateProjectPage />}
        {route.name === routes.compareProjects.name && (
          <ProjectsImpactsComparisonPage
            siteName="Ancienne carrière d'argile de Blajan"
            projectName="Centrale photovoltaïque"
          />
        )}
        {route.name === routes.selectProjectToCompare.name && (
          <ProjectsComparisonSelectionPage route={route} />
        )}
        {route.name === routes.projectImpacts.name && (
          <ProjectImpactsPage
            siteName="Ancienne carrière d'argile de Blajan"
            projectName="Centrale photovoltaïque"
          />
        )}
        {route.name === false && <>Page non trouvée</>}
      </main>
    </HeaderFooterLayout>
  );
}

export default App;

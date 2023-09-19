import { fr } from "@codegouvfr/react-dsfr";
import HeaderFooterLayout from "./components/layout/HeaderFooterLayout/HeaderFooterLayout";
import CreateUserPage from "./components/pages/CreateUser";
import HomePage from "./components/pages/Home";
import LoginPage from "./components/pages/Login";
import OnboardingPage from "./components/pages/Onboarding";
import CreateSiteFoncierPage from "./components/pages/SiteFoncier/Create/Index";
import SiteFoncierDetailsPage from "./components/pages/SiteFoncier/Details";
import SitesFonciersListPage from "./components/pages/SiteFoncier/List";
import { routes, useRoute } from "./router";

function App() {
  const route = useRoute();

  return (
    <HeaderFooterLayout>
      <main className={fr.cx("fr-container", "fr-py-10w")}>
        {route.name === routes.home.name && <HomePage />}
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
        {route.name === false && <>Page non trouvée</>}
      </main>
    </HeaderFooterLayout>
  );
}

export default App;

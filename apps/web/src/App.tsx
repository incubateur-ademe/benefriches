import { fr } from "@codegouvfr/react-dsfr";
import HeaderFooterLayout from "./components/layout/HeaderFooterLayout/HeaderFooterLayout";
import { useRoute, routes } from "./router";
import HomePage from "./components/pages/Home";
import SiteFoncierCreationForm from "./components/pages/SiteFoncier/Creation/Index";
import SitesFonciersListPage from "./components/pages/SiteFoncier/List";
import SiteFoncierDetailsPage from "./components/pages/SiteFoncier/Details";
import LoginPage from "./components/pages/Login";
import CreateUserPage from "./components/pages/CreateUser";

function App() {
  const route = useRoute();

  return (
    <HeaderFooterLayout>
      <main className={fr.cx("fr-container", "fr-py-10w")}>
        {route.name === routes.home.name && <HomePage />}
        {route.name === routes.mesSitesFonciers.name && (
          <SitesFonciersListPage />
        )}
        {route.name === routes.siteFoncierDetails.name && (
          <SiteFoncierDetailsPage
            siteFoncierName={route.params.siteFoncierName}
          />
        )}
        {route.name === routes.login.name && <LoginPage />}
        {route.name === routes.createUser.name && <CreateUserPage />}
        {route.name === routes.siteFoncierForm.name && (
          <SiteFoncierCreationForm route={route} />
        )}
        {route.name === false && <>Page non trouvée</>}
      </main>
    </HeaderFooterLayout>
  );
}

export default App;

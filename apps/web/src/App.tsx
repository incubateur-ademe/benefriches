import { fr } from "@codegouvfr/react-dsfr";
import HeaderFooterLayout from "./components/layout/HeaderFooterLayout/HeaderFooterLayout";
import { useRoute } from "./router";
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
        {/* TODO: exporter les noms de route depuis le router ou ailleurs pour éviter d'avoir des magic string */}
        {route.name === "home" && <HomePage />}
        {route.name === "mesSitesFonciers" && <SitesFonciersListPage />}
        {route.name === "siteFoncierDetails" && (
          <SiteFoncierDetailsPage
            siteFoncierName={route.params.siteFoncierName}
          />
        )}
        {route.name === "login" && <LoginPage />}
        {route.name === "createUser" && <CreateUserPage />}
        {route.name === "siteFoncierForm" && (
          <SiteFoncierCreationForm route={route} />
        )}
        {route.name === false && <>Page non trouvée</>}
      </main>
    </HeaderFooterLayout>
  );
}

export default App;

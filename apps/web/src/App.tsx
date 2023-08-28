import { fr } from "@codegouvfr/react-dsfr";
import HeaderFooterLayout from "./components/layout/HeaderFooterLayout/HeaderFooterLayout";
import { useRoute } from "./router";
import HomePage from "./components/pages/Home";
import SiteFoncierCreationForm from "./components/pages/SiteFoncier/Creation/Index";

function App() {
  const route = useRoute();

  return (
    <HeaderFooterLayout>
      <main className={fr.cx("fr-container", "fr-py-10w")}>
        {route.name === "home" && <HomePage />}
        {route.name === "siteFoncierForm" && (
          <SiteFoncierCreationForm route={route} />
        )}
        {route.name === false && <>Not Found</>}
      </main>
    </HeaderFooterLayout>
  );
}

export default App;

import { fr } from "@codegouvfr/react-dsfr";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import HeaderFooterLayout from "./components/layout/HeaderFooterLayout/HeaderFooterLayout";

function App() {
  return (
    <HeaderFooterLayout>
      <main className={fr.cx("fr-container", "fr-py-10w")}>
        <CallOut title="En construction">
          Bénéfriches est actuellement en cours de construction
        </CallOut>
      </main>
    </HeaderFooterLayout>
  );
}

export default App;

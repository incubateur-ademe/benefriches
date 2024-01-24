import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import { Footer } from "@codegouvfr/react-dsfr/Footer";

import { routes } from "@/app/application/router";

function BenefrichesFooter() {
  return (
    <Footer
      accessibility="non compliant"
      contentDescription={
        <>
          Bénéfriches est un service numérique public gratuit, porté par l’accélérateur de la
          transition écologique, l'incubateur interne de l'ADEME.
          <br />
          Son code est ouvert et accessible à tous{" "}
          <a
            href="https://github.com/incubateur-ademe/benefriches"
            target="_blank"
            rel="noreferrer"
          >
            Voir le code source
          </a>
        </>
      }
      license={
        <>
          Sauf mention contraire, tous les contenus de ce site sont sous{" "}
          <a
            href="https://github.com/incubateur-ademe/benefriches/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
          >
            licence MIT
          </a>
        </>
      }
      bottomItems={[
        { text: "Statistiques", linkProps: routes.stats().link },
        headerFooterDisplayItem,
      ]}
    />
  );
}

export default BenefrichesFooter;

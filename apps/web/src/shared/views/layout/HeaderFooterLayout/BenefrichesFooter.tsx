import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import { Footer } from "@codegouvfr/react-dsfr/Footer";

import { routes } from "@/shared/views/router";

function BenefrichesFooter() {
  return (
    <Footer
      accessibility="non compliant"
      contentDescription={
        <>
          Bénéfriches est un service numérique public gratuit, porté par l'accélérateur de la
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
      accessibilityLinkProps={{ ...routes.accessibilite().link }}
      termsLinkProps={{ ...routes.mentionsLegales().link }}
      bottomItems={[
        { text: "Politique de confidentialité", linkProps: routes.politiqueConfidentialite().link },
        { text: "Statistiques", linkProps: routes.stats().link },
        { text: "Contact", linkProps: { href: "https://tally.so/r/wvAdk8", target: "_blank" } },
        headerFooterDisplayItem,
      ]}
    />
  );
}

export default BenefrichesFooter;

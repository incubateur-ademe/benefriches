import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import { Footer } from "@codegouvfr/react-dsfr/Footer";

import { routes } from "@/shared/views/router";

import ExternalLink from "../../components/ExternalLink/ExternalLink";

function BenefrichesFooter() {
  return (
    <Footer
      id="footer"
      accessibility="non compliant"
      contentDescription={
        <>
          Bénéfriches est un service numérique public gratuit, porté par l'accélérateur de la
          transition écologique, l'incubateur interne de l'ADEME.
          <br />
          Son code est ouvert et accessible à tous{" "}
          <ExternalLink href="https://github.com/incubateur-ademe/benefriches">
            Voir le code source
          </ExternalLink>
        </>
      }
      license={
        <>
          Sauf mention contraire, tous les contenus de ce site sont sous{" "}
          <ExternalLink href="https://github.com/incubateur-ademe/benefriches/blob/main/LICENSE">
            licence MIT
          </ExternalLink>
        </>
      }
      accessibilityLinkProps={{ ...routes.accessibilite().link }}
      termsLinkProps={{ ...routes.mentionsLegales().link }}
      bottomItems={[
        { text: "Politique de confidentialité", linkProps: routes.politiqueConfidentialite().link },
        { text: "Statistiques", linkProps: routes.stats().link },
        {
          text: "Contact",
          linkProps: {
            href: "https://tally.so/r/wvAdk8",
            target: "_blank",
            title: "Contact - ouvre une nouvelle fenêtre",
          },
        },
        headerFooterDisplayItem,
      ]}
    />
  );
}

export default BenefrichesFooter;

import { ReactNode } from "react";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";

const BENEFRICHES_SPREADSHEET_URL =
  "https://librairie.ademe.fr/changement-climatique-et-energie/3772-evaluer-les-benefices-socio-economiques-de-la-reconversion-de-friches-pour-lutter-contre-l-artificialisation-outil-benefriches.html?results=1009";

const BENEFRICHES_TUTORIAL_URL = "https://www.dailymotion.com/video/x8l52by";

const BENEFRICHES_DOCUMENTATION_URL =
  "https://librairie.ademe.fr/changement-climatique-et-energie/3772-evaluer-les-benefices-socio-economiques-de-la-reconversion-de-friches-pour-lutter-contre-l-artificialisation-outil-benefriches.html";

type ExternalLinkProps = {
  href: string;
  children: ReactNode;
};

const ExternalLink = ({ href, children }: ExternalLinkProps) => {
  return (
    <a href={href} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  );
};

function HomePage() {
  return (
    <>
      <h1>Bénéfriches</h1>
      <CallOut title="Ce service est actuellement en cours de construction.">
        <span>
          En attendant son ouverture, il est toujours possible d'utiliser le&nbsp;
          <ExternalLink href={BENEFRICHES_SPREADSHEET_URL}>tableur de calcul</ExternalLink>
          &nbsp;(téléchargement libre).
        </span>
        <br />
        <span>
          Pour vous aider dans son utilisation, consultez le&nbsp;
          <ExternalLink href={BENEFRICHES_TUTORIAL_URL}>tutoriel</ExternalLink>
          &nbsp;et la&nbsp;
          <ExternalLink href={BENEFRICHES_DOCUMENTATION_URL}>notice d'utilisation</ExternalLink>.
        </span>
        <br />
        <br />
        <span>
          Un webinaire de présentation avec du retour d'expérience est aussi accessible en{" "}
          <ExternalLink href="https://www.dailymotion.com/video/x8msk3b">replay</ExternalLink>.
        </span>
      </CallOut>
    </>
  );
}

export default HomePage;

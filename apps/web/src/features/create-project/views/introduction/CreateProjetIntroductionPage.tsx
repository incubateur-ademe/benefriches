import { fr } from "@codegouvfr/react-dsfr";
import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { Button } from "@codegouvfr/react-dsfr/Button";

import { routes } from "@/app/application/router";

type Props = {
  siteId: string;
  siteName: string;
  siteLoadingState: "idle" | "loading" | "success" | "error";
};

function CreateProjectIntroductionPage({ siteId, siteName, siteLoadingState }: Props) {
  switch (siteLoadingState) {
    case "idle":
      return null;
    case "loading":
      return <p>Chargement des informations du site, veuillez patienter...</p>;
    case "error":
      return (
        <p>
          Une erreur est survenue lors du chargement des informations du site, veuillez réessayer.
        </p>
      );
    case "success":
      return (
        <>
          <h2>Vous avez un projet d'aménagement sur le site "{siteName}".</h2>
          <p>
            Nous allons ici parler de votre <strong>projet d'aménagement</strong> : la nature du
            projet, la transformation des sols du site, les acteurs associés, les coûts et recettes
            prévisionnels, le calendrier des travaux , etc.
          </p>
          <Accordion label="Documents utiles" className={fr.cx("fr-mb-4w")}>
            <p>
              Pour vous aider à saisir les informations liées à votre projet, il peut être utile
              d'avoir les ressources suivantes :
            </p>
            <ul>
              <li>Plan d'aménagement (ou plan masse)</li>
              <li>Permis d'aménager ou de construire</li>
              <li>
                Dossiers réglementaires le cas échéant (ICPE, loi sur l'eau, dérogation espèces
                protégées, etc.)
              </li>
              <li>Titre de propriété ou acte de vente</li>
              <li>Bilan économique de l'opération (ou plan d'affaire le cas échéant)</li>
            </ul>
          </Accordion>
          <Button linkProps={routes.createProject({ siteId }).link}>Commencer</Button>
        </>
      );
  }
}

export default CreateProjectIntroductionPage;

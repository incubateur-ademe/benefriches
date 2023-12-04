import { Button } from "@codegouvfr/react-dsfr/Button";

import { routes } from "@/router";

type Props = {
  siteId: string;
  siteName: string;
  siteLoadingState: "idle" | "loading" | "success" | "error";
};

function CreateProjectIntroductionPage({
  siteId,
  siteName,
  siteLoadingState,
}: Props) {
  switch (siteLoadingState) {
    case "idle":
      return null;
    case "loading":
      return <p>Chargement des informations du site, veuillez patienter...</p>;
    case "error":
      return (
        <p>
          Une erreur est survenue lors du chargement des informations du site,
          veuillez réessayer.
        </p>
      );
    case "success":
      return (
        <>
          <h2>Vous avez un projet d'aménagement sur le site "{siteName}".</h2>
          <h3>Documents utiles</h3>
          <p>
            Pour vous aider à saisir les informations liées à votre projet, nous
            vous conseillons de mobiliser les ressources suivantes :
          </p>
          <ul>
            <li>Plan d'aménagement (ou plan masse)</li>
            <li>Permis d'aménager ou de construire</li>
            <li>
              Dossiers réglementaires le cas échéant (ICPE, loi sur l'eau,
              dérogation espèces protégées, etc.)
            </li>
            <li>Acte de vente</li>
            <li>
              Bilan économique de l'opération (ou plan d'affaire le cas échéant
            </li>
          </ul>
          <p>
            Vous pourrez remplir le formulaire si vous ne disposez pas de toutes
            les informations, Bénéfriches vous proposant des valeurs par défaut,
            issues du retour d'expérience de l'ADEME ou autres ressources
            documentaires.
          </p>
          <p>
            Néanmoins, plus les données renseignées seront spécifiques, plus les
            résultats seront pertinents et fiables !
          </p>
          <Button linkProps={routes.createProject({ siteId }).link}>
            C'est parti !
          </Button>
        </>
      );
  }
}

export default CreateProjectIntroductionPage;

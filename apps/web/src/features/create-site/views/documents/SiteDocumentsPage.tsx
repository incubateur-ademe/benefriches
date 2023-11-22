import { Button } from "@codegouvfr/react-dsfr/Button";

import { routes } from "@/router";

function SiteCreationDocumentsPage() {
  return (
    <>
      <h2>Documents utiles</h2>

      <p>
        Pour vous aider à saisir les informations liées au site, nous vous
        conseillons de vous munir des documents suivants :
      </p>

      <ul>
        <li>Plan cadastral du site</li>
        <li>Relevés des sols et bâtiments</li>
        <li>Bilan comptable du site</li>
      </ul>

      <p>
        Vous pourrez remplir le formulaire si vous n’avez pas ces documents car
        la plupart des questions ne sont pas obligatoires.
      </p>
      <p>
        Néanmoins, plus les informations seront complètes, plus les résultats
        seront fiables !
      </p>
      <Button linkProps={routes.createSiteFoncier().link}>
        Saisir les informations
      </Button>
    </>
  );
}

export default SiteCreationDocumentsPage;

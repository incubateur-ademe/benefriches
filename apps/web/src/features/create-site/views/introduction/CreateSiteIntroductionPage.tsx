import { Button } from "@codegouvfr/react-dsfr/Button";

import { routes } from "@/router";

function CreateSiteIntroductionPage() {
  return (
    <>
      <h1>Tout commence sur un site</h1>
      <p>
        Nous allons d’abord parler du <strong>site existant</strong> : la nature
        du site, la typologie de ses sols, les dépenses associées, etc.
      </p>
      <p>
        Une fois que ce site sera décrit, vous pourrez alors créer un ou
        plusieurs <strong>projets d'aménagment</strong> sur ce site.
      </p>
      <h2>Documents utiles</h2>
      <p>
        Pour vous aider à saisir les informations liées au site, nous vous
        conseillons de mobiliser les ressources suivantes :
      </p>
      <ul>
        <li>Plan cadastral du site</li>
        <li>Acte de vente</li>
        <li>
          Logiciel de cartographie satellite (exemple:{" "}
          <a
            href="https://www.openstreetmap.fr/"
            rel="noopener noreferrer"
            target="_blank"
          >
            OpenStreetMap
          </a>
          )
        </li>
        <li>Photographies</li>
        <li>
          Carte des anciens sites industriels et de services (
          <a
            href="https://infoterre.brgm.fr/viewer/MainTileForward.do"
            rel="noopener noreferrer"
            target="_blank"
          >
            https://infoterre.brgm.fr/viewer/MainTileForward.do
          </a>
          )
        </li>
        <li>Rapports de diagnostics de pollution ou plan de gestion</li>
        <li>
          Compte de résultat ou données économiques du site (gardiennage, loyer,
          etc.)
        </li>
      </ul>

      <p>
        Vous pourrez remplir le formulaire si vous ne disposez pas de toutes les
        informations, BENEFRICHES vous proposant des valeurs par défaut, issues
        du retour d'expérience de l'ADEME ou autres ressources documentaires.
      </p>
      <p>
        Néanmoins, plus les données renseignées seront spécifiques, plus les
        résultats seront pertinents et fiables !
      </p>
      <Button linkProps={routes.createSiteFoncier().link}>
        Saisir les informations
      </Button>
    </>
  );
}

export default CreateSiteIntroductionPage;

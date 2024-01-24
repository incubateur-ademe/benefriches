import { useEffect } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { resetState } from "../../application/createSite.reducer";

import { routes } from "@/app/application/router";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";

function CreateSiteIntroductionPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetState());
  }, [dispatch]);

  return (
    <>
      <h1>Tout commence sur un site</h1>
      <p>
        Nous allons d’abord parler du <strong>site existant</strong> : la nature du site, la
        typologie de ses sols, les dépenses associées, etc.
      </p>
      <p>
        Une fois que ce site sera décrit, vous pourrez alors créer un ou plusieurs{" "}
        <strong>projets d'aménagement</strong> sur ce site.
      </p>
      <Accordion label="Documents utiles" className={fr.cx("fr-mb-4w")}>
        <p>
          Pour vous aider à saisir les informations liées à votre projet, il peut être utile d'avoir
          les ressources suivantes :
        </p>
        <ul>
          <li>Plan cadastral du site</li>
          <li>Acte de vente</li>
          <li>
            Logiciel de cartographie satellite (exemple:{" "}
            <a href="https://www.openstreetmap.fr/" rel="noopener noreferrer" target="_blank">
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
          <li>Compte de résultat ou données économiques du site (gardiennage, loyer, etc.)</li>
        </ul>
      </Accordion>
      <Button linkProps={routes.createSiteFoncier().link}>Commencer</Button>
    </>
  );
}

export default CreateSiteIntroductionPage;

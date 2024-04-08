import { useEffect } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import Accordion from "@codegouvfr/react-dsfr/Accordion";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { resetState } from "../../application/createSite.reducer";

import { routes } from "@/app/views/router";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";
import { useAppDispatch } from "@/shared/views/hooks/store.hooks";
import WizardFormLayout from "@/shared/views/layout/WizardFormLayout/WizardFormLayout";

function CreateSiteIntroductionPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetState());
  }, [dispatch]);

  return (
    <section className={fr.cx("fr-container", "fr-py-4w")}>
      <WizardFormLayout title="Tout commence sur un site">
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
            Pour vous aider à renseigner les informations décrivant le site, il peut être utile
            d'avoir les ressources suivantes :
          </p>
          <ul>
            <li>Photographies</li>
            <li>
              Plan cadastral du site (accessible en ligne sur{" "}
              <ExternalLink href="https://www.geoportail.gouv.fr/">Géoportail</ExternalLink>)
            </li>
            <li>
              Logiciel de cartographie satellite (exemple:{" "}
              <ExternalLink href="https://www.geoportail.gouv.fr/">Géoportail</ExternalLink> ou{" "}
              <ExternalLink href="https://www.openstreetmap.fr/">OpenStreetMap</ExternalLink>)
            </li>
            <li>
              Carte des sites et sols potentiellement pollués (
              <ExternalLink href="https://infoterre.brgm.fr/viewer/MainTileForward.do">
                Infoterre
              </ExternalLink>
              )
            </li>
            <li>
              Rapports des éventuelles études menées sur le site (étude de faisabilité d’un projet,
              étude faune-flore, diagnostic de pollution, etc.)
            </li>
            <li>Dépenses liées au site (gardiennage, loyer, etc.)</li>
          </ul>
        </Accordion>
        <Button linkProps={routes.createSiteFoncier().link}>Commencer</Button>
      </WizardFormLayout>
    </section>
  );
}

export default CreateSiteIntroductionPage;

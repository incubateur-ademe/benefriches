import { formatDefaultImpact } from "@/features/projects/views/shared/formatImpactValue";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import ModalTitleThree from "@/features/projects/views/shared/impacts/modals/ModalTitleThree";
import ModalTitleTwo from "@/features/projects/views/shared/impacts/modals/ModalTitleTwo";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import TravelRelatedImpactsIntroduction from "../../shared/travel-related-impacts-introduction/TravelRelatedImpactsIntroduction";
import { mainBreadcrumbSection, localPeopleBreadcrumbSection } from "../breadcrumbSections";

const TITLE = "Temps passé en moins dans les transports";

type Props = {
  impactData?: number;
};

const TimeTravelSavedDescription = ({ impactData }: Props) => {
  return (
    <ModalBody size="large">
      <ModalHeader
        title={`⏱️ ${TITLE}`}
        subtitle="Grâce à la ou les commodités créées dans le quartier"
        value={
          impactData
            ? {
                state: "success",
                text: `${formatDefaultImpact(impactData)} h`,
                description: "pour la population locale",
              }
            : undefined
        }
        breadcrumbSegments={[mainBreadcrumbSection, localPeopleBreadcrumbSection, { label: TITLE }]}
      />
      <ModalContent fullWidth>
        <TravelRelatedImpactsIntroduction />

        <p>
          Le temps passé en moins dans les transports (exprimé en Nombre de
          «&nbsp;voyageurs.h&nbsp;» évités) est la durée totale qui ne sera pas passée dans les
          transports par les personnes impactées par le projet. Les personnes impactées par le
          projet peuvent être les nouveaux habitants ou salariés des locaux créés par le projet
          voire les riverains et salariés qui pourraient bénéficier des équipements, activités et
          services créés par le projet (équipements publics, services ou commerces de proximité,
          espaces verts, etc.).
        </p>
        <p>
          <strong>Bénéficiaire</strong> : population locale
        </p>
        <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
        <ModalTitleThree>Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
        <ul>
          <li>Nombre m² de logement / habitant (exprimé en m² SDP / habitant) : 30</li>
          <li>
            Nombre de m²/ salarié pour les locaux tertiaire, d’équipements publics ou de services
            (exprimé en m² SDP / salarié) : 15
          </li>
          <li>
            Nombre de m²/ salarié pour les commerces en pied d’immeuble (exprimé en m² SDP /
            salarié) : 23
          </li>
          <li>
            Nombre de m²/ salarié pour les locaux d’artisanats, industriels ou logistiques (exprimé
            en m² SDP / salarié) : 70
          </li>
          <li>Temps de déplacement évités pour les habitants : 2 min (hypothèse)</li>
          <li>Part des habitants ou salariés impactés par l’effet : 50% (hypothèse)</li>
          <li>
            Nombre de jours annuel pendant lesquels l’effet est considéré : 365 pour les habitants
            et 220 pour les salariés
          </li>
        </ul>

        <ModalTitleThree>Données du projet :</ModalTitleThree>

        <p>
          Les données du projet peuvent avoir été saisies par l’utilisateur·ice ou avoir été
          suggérées par Bénéfriches sur la base d’une moyenne ou d’une hypothèse.
        </p>
        <ul>
          <li>
            Surface de nouveaux logements créés par le projet le cas échéant (exprimée en m² SDP)
          </li>
          <li>
            Surface de nouveaux locaux d’activités économiques, d’équipements publics et de services
            créés par le projet le cas échéant (exprimée en m² SDP)
          </li>
        </ul>

        <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>

        <p>
          Le temps passé en moins dans les transports (exprimé en nombre de « voyageurs.h » évités)
          est calculé séparément pour (1) les habitants, (2) les salariés des commerces de pieds
          d’immeuble, des bureaux, d’équipements publics ou de services, et (3) les salariés des
          locaux d’artisanats, industriels ou logistiques, puis ils sont additionnés. Pour chaque
          catégorie de personne (cf. (1), (2) et (3) supra), la durée de transport évitée est égale
          au temps total de déplacements qui sera évité par la fraction de la catégorie considérée
          comme impactée par le projet, sur la zone d’influence du projet. Chaque fraction est
          exprimée en pourcentage de la totalité de la catégorie multipliée par l’hypothèse du
          nombre de jours affecté à la catégorie de personne.
        </p>

        <p>Exemple pour les habitants : 50% des habitants impactés sur 365 jours.</p>

        <ModalTitleTwo>Sources</ModalTitleTwo>

        <ul>
          <li>
            <ExternalLink href="https://librairie.ademe.fr/changement-climatique-et-energie/3772-evaluer-les-benefices-socio-economiques-de-la-reconversion-de-friches-pour-lutter-contre-l-artificialisation-outil-benefriches.html">
              Référentiel Bénéfriches&nbsp;
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.statistiques.developpement-durable.gouv.fr/enquete-nationale-transports-et-deplacements-entd-2008">
              Enquête nationale transports et déplacements (ENTD) 2008
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.observatoire-des-territoires.gouv.fr/kiosque/2019-fiche-mobilites-se-deplacer-au-quotidien-enjeux-spatiaux-enjeux-sociaux">
              Observatoire des territoires &gt; Se déplacer au quotidien : enjeux spatiaux, enjeux
              sociaux
            </ExternalLink>
          </li>
        </ul>

        <ModalTitleTwo>Aller plus loin</ModalTitleTwo>

        <ul>
          <li>
            <ExternalLink href="https://www.epa.gov/land-revitalization/climate-smart-brownfields-manual">
              Climate Smart Brownfields Manual. US EPA.
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.epa.gov/sites/default/files/2015-05/documents/bfenvironimpacts042811.pdf">
              Air and water quality impacts of brownfields redevelopment: A study of five
              communities. US EPA (2011).
            </ExternalLink>
          </li>
        </ul>
      </ModalContent>
    </ModalBody>
  );
};

export default TimeTravelSavedDescription;

import Button from "@codegouvfr/react-dsfr/Button";
import { useContext } from "react";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import { ImpactModalDescriptionContext } from "../../ImpactModalDescriptionContext";
import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import ModalTitleThree from "../../shared/ModalTitleThree";
import ModalTitleTwo from "../../shared/ModalTitleTwo";
import { mainBreadcrumbSection, socialMonetaryBreadcrumbSection } from "../breadcrumbSections";

const TITLE = "Valeur monétaire du temps passé en moins dans les transports";

type Props = {
  impactData?: number;
};

const LinkToTimeTravelSavedSocialImpact = () => {
  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  return (
    <Button
      onClick={() => {
        openImpactModalDescription({
          sectionName: "social",
          impactName: "travel_time_saved",
        });
      }}
      className="tw-px-1"
      priority="tertiary no outline"
    >
      «&nbsp;⏱ Temps passé en moins dans les transports&nbsp;»
    </Button>
  );
};

const TimeTravelSavedMonetaryValueDescription = ({ impactData }: Props) => {
  return (
    <>
      <ModalHeader
        title={`⏱ ${TITLE}`}
        subtitle="Grâce à la ou les commodités créées dans le quartier"
        value={
          impactData
            ? {
                state: "success",
                text: formatMonetaryImpact(impactData),
                description: "pour la population locale",
              }
            : undefined
        }
        breadcrumbSegments={[
          mainBreadcrumbSection,
          socialMonetaryBreadcrumbSection,
          { label: TITLE },
        ]}
      />
      <ModalContent>
        <p>
          La création de logements, équipements publics, espaces verts ou encore locaux d’activités
          ou de service au sein des centres villes en opposition à la localisation de ces mêmes
          activités en périphérie peut engendrer une réduction de l’utilisation des véhicules
          particuliers, comme l’ont montré de nombreuses études de mobilité ou scientifiques. Cette
          diminution est à caractériser selon la nature des déplacements réalisés, du type de tissu
          urbain et des distances parcourues. Elle génère en particulier les effets suivants&nbsp;:
        </p>
        <ul>
          <li>Effet sur les émissions de GES</li>
          <li>Effet sur la pollution locale</li>
          <li>Effet sur les coûts de déplacement des usagers</li>
          <li>Effet sur le temps de parcours des usagers</li>
          <li>Effet en termes de sécurité routière</li>
        </ul>
        <p>
          La valeur monétaire du temps passé en moins dans les transports (exprimée en €/an) est la
          traduction de l’adage “le temps c’est de l’argent”.
        </p>
        <p>
          <strong>Bénéficiaire</strong> : population locale
        </p>
        <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
        <ModalTitleThree>Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
        <ul>
          <li>Valeur du temps voyageur (exprimée en €/voyageur.heure) : 10 (en 2018)</li>
        </ul>
        Pour les autres données, se référer à l’indicateur <LinkToTimeTravelSavedSocialImpact />
        <ModalTitleThree>Données du projet :</ModalTitleThree>
        <p>
          Se référer à l’indicateur <LinkToTimeTravelSavedSocialImpact />
        </p>
        <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
        <p>
          La valeur monétaire du temps passé en moins dans les transports (exprimée en €/an) est le
          produit de l’indicateur <LinkToTimeTravelSavedSocialImpact /> annuellement (exprimé en
          Nombre de « voyageurs.h/an » évités) par la valeur du temps voyageur (exprimée en
          €/voyageur.heure).
        </p>
        <ModalTitleTwo>Sources</ModalTitleTwo>
        <ul>
          <li>
            <ExternalLink href="https://www.ecologie.gouv.fr/politiques-publiques/evaluation-projets-transport#fiches-outils-du-referentiel-devaluation-des-projets-de-transport-4">
              Fiches outils de l’instruction du Gouvernement du 16 juin 2014 - Cadre général de
              l’évaluation des projets d’infrastructures et de services de transport
            </ExternalLink>
          </li>
          <li>
            Pour les autres sources, se référer à l’indicateur <LinkToTimeTravelSavedSocialImpact />
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
    </>
  );
};

export default TimeTravelSavedMonetaryValueDescription;

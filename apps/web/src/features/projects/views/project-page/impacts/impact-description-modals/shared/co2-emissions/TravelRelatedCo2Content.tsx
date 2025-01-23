import Button from "@codegouvfr/react-dsfr/Button";
import { useContext } from "react";

import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import { ImpactModalDescriptionContext } from "../../ImpactModalDescriptionContext";
import ModalTitleThree from "../ModalTitleThree";
import ModalTitleTwo from "../ModalTitleTwo";

const LinkToAvoidedKilometersImpact = () => {
  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  return (
    <Button
      onClick={() => {
        openImpactModalDescription({
          sectionName: "social",
          impactName: "avoided_vehicule_kilometers",
        });
      }}
      className="tw-px-1"
      priority="tertiary no outline"
    >
      « 🚙 Kilomètres évités »
    </Button>
  );
};

type Props = {
  withMonetarisation?: boolean;
};

const TravelRelatedCo2Content = ({ withMonetarisation = false }: Props) => {
  return (
    <>
      <p>
        La création de logements, équipements publics, espaces verts ou encore locaux d’activités ou
        de service au sein des centres villes en opposition à la localisation de ces mêmes activités
        en périphérie peut engendrer une réduction de l’utilisation des véhicules particuliers,
        comme l’ont montré de nombreuses études de mobilité ou scientifiques. Cette diminution est à
        caractériser selon la nature des déplacements réalisés, du type de tissu urbain et des
        distances parcourues. Elle génère en particulier les effets suivants&nbsp;:
      </p>
      <ul>
        <li>Effet sur les émissions de GES</li>
        <li>Effet sur la pollution locale</li>
        <li>Effet sur les coûts de déplacement des usagers</li>
        <li>Effet sur le temps de parcours des usagers</li>
        <li>Effet en termes de sécurité routière</li>
      </ul>

      <p>
        La réduction des déplacements attendue par la réalisation du projet urbain en centralité
        conduira à de moindres émissions de CO2 des véhicules (le parc automobile étant encore
        largement thermique).
      </p>
      <p>
        <strong>Bénéficiaire</strong> : humanité
      </p>
      <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
      <ModalTitleThree>Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
      <ul>
        <li>
          Emission moyenne en CO2 d’un déplacement (exprimé en gCO2/véhicule.km) : variable selon
          l’année, le parc automobile ayant tendance à être de plus en plus décarboné
        </li>
        <li>
          Taux d'occupation moyen des véhicules (exprimé en nombre de personne / véhicule) : 1,45
        </li>
        <li>
          Pour les autres données, se référer à l’indicateur d’impact social “Kilomètres évités”
        </li>
      </ul>

      <ModalTitleThree>Données du projet :</ModalTitleThree>

      <p>
        Se référer à l’indicateur d’impact social <LinkToAvoidedKilometersImpact />
      </p>

      <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>

      {withMonetarisation ? (
        <p>
          La valeur économique associée aux émissions de CO2 évitées par une baisse de déplacements
          attendue (exprimées en €/an) est le produit de l’indicateur d’impact social{" "}
          <LinkToAvoidedKilometersImpact /> annuellement (exprimé en nombre de « voyageurs.km/an »
          évités) par le taux d'occupation moyen des véhicules (exprimé en nombre de personne /
          véhicule), par l’émission moyenne en CO2 d’un déplacement (exprimé en gCO2/véhicule.km) et
          par la valeur tutélaire du carbone (exprimée en €/t éq. CO2).
        </p>
      ) : (
        <p>
          Les émissions de CO2 évitées par une baisse de déplacements attendue (exprimées en €/an)
          est le produit de l’indicateur d’impact social <LinkToAvoidedKilometersImpact />{" "}
          annuellement (exprimé en nombre de « voyageurs.km/an » évités) par le taux d'occupation
          moyen des véhicules (exprimé en nombre de voyageurs / véhicule) et par l’émission moyenne
          en CO2 d’un déplacement (exprimé en gCO2/véhicule.km).
        </p>
      )}

      <ModalTitleTwo>Sources</ModalTitleTwo>

      <ul>
        <li>
          <ExternalLink href="https://www.ecologie.gouv.fr/politiques-publiques/evaluation-projets-transport#fiches-outils-du-referentiel-devaluation-des-projets-de-transport-4">
            Fiches outils de l’instruction du Gouvernement du 16 juin 2014 - Cadre général de
            l’évaluation des projets d’infrastructures et de services de transport
          </ExternalLink>
        </li>
        {withMonetarisation && (
          <li>
            <ExternalLink href="https://www.strategie.gouv.fr/sites/strategie.gouv.fr/files/atoms/files/fs-2019-rapport-la-valeur-de-laction-pour-le-climat_0.pdf">
              Valeur tutélaire du carbone
            </ExternalLink>
          </li>
        )}
        <li>
          Pour les autres sources, se référer à l’indicateur d’impact social{" "}
          <LinkToAvoidedKilometersImpact />
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
            Air and water quality impacts of brownfields redevelopment: A study of five communities.
            US EPA (2011).
          </ExternalLink>
        </li>
      </ul>
    </>
  );
};

export default TravelRelatedCo2Content;

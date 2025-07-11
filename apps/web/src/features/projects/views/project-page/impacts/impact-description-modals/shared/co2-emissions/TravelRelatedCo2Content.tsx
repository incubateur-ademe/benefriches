import ModalTitleThree from "@/features/projects/views/shared/impacts/modals/ModalTitleThree";
import ModalTitleTwo from "@/features/projects/views/shared/impacts/modals/ModalTitleTwo";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import LinkToAvoidedKilometersImpact from "../avoided-kilometers-social-impact-link/AvoidedKilometersSocialImpactLink";
import TravelRelatedImpactsIntroduction from "../travel-related-impacts-introduction/TravelRelatedImpactsIntroduction";

type Props = {
  withMonetarisation?: boolean;
};

const TravelRelatedCo2Content = ({ withMonetarisation = false }: Props) => {
  return (
    <>
      <TravelRelatedImpactsIntroduction />

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

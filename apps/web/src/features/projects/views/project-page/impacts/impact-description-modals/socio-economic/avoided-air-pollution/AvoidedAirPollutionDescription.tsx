import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import ModalBody from "../../shared/ModalBody";
import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import ModalTitleThree from "../../shared/ModalTitleThree";
import ModalTitleTwo from "../../shared/ModalTitleTwo";
import LinkToAvoidedKilometersImpact from "../../shared/avoided-kilometers-social-impact-link/AvoidedKilometersSocialImpactLink";
import TravelRelatedImpactsIntroduction from "../../shared/travel-related-impacts-introduction/TravelRelatedImpactsIntroduction";
import { mainBreadcrumbSection, socialMonetaryBreadcrumbSection } from "../breadcrumbSections";

const TITLE = "Dépenses de santé évitées grâce à la réduction de la pollution de l’air";

type Props = {
  impactData?: number;
};

const AvoidedAirPollutionDescription = ({ impactData }: Props) => {
  return (
    <ModalBody>
      <ModalHeader
        title={`💨 ${TITLE}`}
        subtitle="Grâce aux déplacements évités"
        value={
          impactData
            ? {
                state: "success",
                text: formatMonetaryImpact(impactData),
                description: "pour la société française",
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
        <TravelRelatedImpactsIntroduction />

        <p>
          La réduction des déplacements attendue par la réalisation du projet urbain en centralité
          conduira à de moindres émissions de polluants atmosphériques des véhicules (le parc
          automobile étant encore largement thermique). Conduisant ainsi à des impacts réduits en
          termes de santé public, donc des dépenses de santé évitées (exprimées en €/an).
        </p>
        <p>
          <strong>Bénéficiaire</strong> : société française
        </p>
        <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
        <ModalTitleThree>Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
        <ul>
          <li>Densité de population communale (qui détermine la densité du tissu urbain)</li>
          <li>
            Coût sanitaire de la pollution atmosphérique (exprimée en €/véhicule.km) : variable
            selon la densité du tissu urbain traversé
          </li>
          <li>
            Taux d'occupation moyen des véhicules (exprimé en nombre de personne / véhicule) : 1,45
          </li>
          <li>
            Pour les autres données, se référer à l’indicateur d’impact social{" "}
            <LinkToAvoidedKilometersImpact />
          </li>
        </ul>

        <ModalTitleThree>Données du projet :</ModalTitleThree>
        <p>
          Se référer à l’indicateur <LinkToAvoidedKilometersImpact />
        </p>
        <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
        <p>
          Les dépenses de santé évitées (exprimées en €/an) sont le produit de l’indicateur d’impact
          social <LinkToAvoidedKilometersImpact /> annuellement (exprimé en nombre de «
          voyageurs.km/an » évités) par le taux d'occupation moyen des véhicules (exprimé en nombre
          de personne / véhicule) et par le coût sanitaire de la pollution atmosphérique (exprimée
          en €/100véhicules.km).
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
            Pour les autres sources, se référer à l’indicateur <LinkToAvoidedKilometersImpact />
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

export default AvoidedAirPollutionDescription;

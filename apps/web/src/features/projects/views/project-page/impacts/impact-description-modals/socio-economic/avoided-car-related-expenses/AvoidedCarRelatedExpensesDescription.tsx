import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import ModalTitleThree from "@/features/projects/views/shared/impacts/modals/ModalTitleThree";
import ModalTitleTwo from "@/features/projects/views/shared/impacts/modals/ModalTitleTwo";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import LinkToAvoidedKilometersImpact from "../../shared/avoided-kilometers-social-impact-link/AvoidedKilometersSocialImpactLink";
import TravelRelatedImpactsIntroduction from "../../shared/travel-related-impacts-introduction/TravelRelatedImpactsIntroduction";
import {
  localPeopleOrCompanyBreadcrumbSection,
  mainBreadcrumbSection,
} from "../breadcrumbSections";

const TITLE = "Dépenses automobiles évitées";

type Props = {
  impactData?: number;
};

const AvoidedCarRelatedExpensesDescription = ({ impactData }: Props) => {
  return (
    <ModalBody size="large">
      <ModalHeader
        title={`🚗 ${TITLE}`}
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
          localPeopleOrCompanyBreadcrumbSection,
          { label: TITLE },
        ]}
      />
      <ModalContent fullWidth>
        <TravelRelatedImpactsIntroduction />

        <p>
          Les dépenses automobiles évitées (exprimées en €/an) correspondent aux dépenses
          d’entretien, d’amortissement et énergétiques (associées à l’utilisation des véhicules
          individuels) évités du fait d’une moindre utilisation de ces véhicules.
        </p>
        <p>
          <strong>Bénéficiaire</strong> : population locale
        </p>
        <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
        <ModalTitleThree>Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
        <ul>
          <li>
            Valeur du coût ressenti de la mobilité (exprimée en €/véhicule.km) : 0,1 (en 2018)
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
          Les dépenses automobiles évitées (exprimées en €/an) sont le produit de l’indicateur
          d’impact social <LinkToAvoidedKilometersImpact /> annuellement (exprimé en nombre de «
          voyageurs.km/an » évités) par le taux d'occupation moyen des véhicules (exprimé en nombre
          de personne / véhicule) et par la valeur du coût ressenti de la mobilité (exprimée en
          €/véhicule.km).
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

export default AvoidedCarRelatedExpensesDescription;

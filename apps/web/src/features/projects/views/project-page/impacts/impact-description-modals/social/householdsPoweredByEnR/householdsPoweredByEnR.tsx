import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import ModalTitleThree from "../../shared/ModalTitleThree";
import ModalTitleTwo from "../../shared/ModalTitleTwo";
import { mainBreadcrumbSection, frenchSocietyBreadcrumbSection } from "../breadcrumbSections";

type Props = {
  address: string;
  developmentPlanSurfaceArea?: number;
  developmentPlanElectricalPowerKWc?: number;
};

const HouseholdsPoweredByRenewableEnergyDescription = ({
  address,
  developmentPlanSurfaceArea,
  developmentPlanElectricalPowerKWc,
}: Props) => {
  return (
    <>
      <ModalHeader
        title="🏠 Foyers alimentés par les EnR"
        breadcrumbSegments={[
          mainBreadcrumbSection,
          frenchSocietyBreadcrumbSection,
          { label: "Foyers alimentés par les EnR" },
        ]}
      />
      <ModalContent>
        <p>
          Cet indicateur propose une illustration du potentiel de production en électricité
          renouvelable qui sera produite par la centrale du projet en nombre de foyers alimentés.
        </p>
        <p>
          <strong>Bénéficiaire</strong> : humanité
        </p>
        <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
        <ModalTitleThree>Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
        <ul>
          <li>
            Consommation d'électricité par personne et par an en France (exprimée en
            kWh/personne/an)
          </li>
          <li>Composition moyenne d'un foyer en France (exprimée en nombre de personnes/foyer)</li>
        </ul>
        <ModalTitleThree> Données du projet</ModalTitleThree>
        <p>
          Les données du projet peuvent avoir été saisies par l'utilisateur·ice ou avoir été
          suggérées par Bénéfriches sur la base d'une moyenne ou d'une hypothèse.
        </p>
        <ul>
          <li>Adresse : {address}</li>
          <li>
            Surface au sol occupée par les panneaux (exprimée en m²) :{" "}
            {developmentPlanSurfaceArea ? formatNumberFr(developmentPlanSurfaceArea) : "Inconnu"}
          </li>
          <li>
            Puissance installée (exprimée en kWc) :{" "}
            {developmentPlanElectricalPowerKWc
              ? formatNumberFr(developmentPlanElectricalPowerKWc)
              : "Inconnu"}
          </li>
        </ul>
        <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
        <p>
          Sur la base des données du projet photovoltaïque, la production d'énergie renouvelable
          attendue annuellement (exprimée en kWh/an) est calculée avec l'outil PVGIS de la
          Commission européenne (renvoi vers indicateur impact CO2 lié à la production d'ENR).
        </p>
        <p>
          La consommation annuelle d'un foyer français (exprimée en kWh/foyer/an) est calculée en
          multipliant la consommation d'électricité par personne et par an en France (exprimée en
          kWh/personne/an) par la composition moyenne d'un foyer (exprimée en nombre de
          personnes/foyer).
        </p>
        <p>
          Le nombre de foyers français pouvant être alimentés par cette production est calculé en
          divisant la valeur de cette production par la consommation annuelle d'un foyer français.
        </p>

        <ModalTitleTwo>Sources</ModalTitleTwo>
        <ul>
          <li>
            <ExternalLink href="https://www.data.gouv.fr/fr/reuses/consommation-par-habitant-et-par-ville-delectricite-en-france/">
              Consommation par habitant et par ville d'électricité en France
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.insee.fr/fr/statistiques/5039855">
              INSEE : Taille et composition des ménages
            </ExternalLink>
          </li>
        </ul>
      </ModalContent>
    </>
  );
};

export default HouseholdsPoweredByRenewableEnergyDescription;

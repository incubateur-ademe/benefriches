import { convertSquareMetersToHectares, SoilType } from "shared";

import { formatCO2Impact } from "@/features/projects/views/shared/formatImpactValue";
import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
import { getLabelForSoilType } from "@/shared/core/label-mapping/soilTypeLabelMapping";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import { ProjectData, SiteData } from "../ImpactModalDescriptionProvider";
import ModalBody from "../shared/ModalBody";
import ModalContent from "../shared/ModalContent";
import ModalHeader from "../shared/ModalHeader";
import ModalTitleThree from "../shared/ModalTitleThree";
import ModalTitleTwo from "../shared/ModalTitleTwo";

const formatSoilSurfaceArea = (surfaceArea: number) => {
  return `${formatNumberFr(convertSquareMetersToHectares(surfaceArea))} ha`;
};

type Props = {
  baseSoilsDistribution: SiteData["soilsDistribution"];
  forecastSoilsDistribution: ProjectData["soilsDistribution"];
  impactData?: number;
};

const SoilsCarbonStorageDescription = ({
  baseSoilsDistribution,
  forecastSoilsDistribution,
  impactData,
}: Props) => {
  return (
    <ModalBody size="large">
      <ModalHeader
        title="🍂 Carbone stocké dans les sols"
        value={
          impactData
            ? {
                state: impactData > 0 ? "success" : "error",
                text: formatCO2Impact(impactData),
              }
            : undefined
        }
        breadcrumbSegments={[{ label: "Carbone stocké dans les sols" }]}
      />
      <ModalContent fullWidth>
        <p>
          Le sol, quand il n'a pas été artificialisé, est un milieu vivant, en perpétuel
          renouvellement. Sa création prend plusieurs centaines d'année (pour quelques centimètres
          de sol en conditions naturelles), mais il peut être détruit en quelques secondes (ex :
          décapage de la terre végétale sur 30cm).
        </p>
        <p>
          Les sols et les végétaux stockent une grande quantité de carbone. A l'échelle globale, ces
          réservoirs de carbone stockent, dans la matière organique des sols, la litière et la
          biomasse vivante ou morte (y compris les produits matériaux issus de la biomasse), 3 à 4
          fois plus de carbone que l'atmosphère !
        </p>
        <p>
          <strong>Bénéficiaire</strong> : humanité
        </p>
        <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
        <ModalTitleThree> Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
        <ul>
          <li>
            Stocks de référence en carbone contenu dans les différents types de sols (ex : prairies,
            forêts, cultures, sols artificialisés) à l'hectare (exprimés en kg éq. C/hectare).
          </li>
        </ul>
        <ModalTitleThree>Données du site</ModalTitleThree>
        <p>
          Les données du site peuvent avoir été saisies par l'utilisateur·ice ou avoir été suggérées
          par Bénéfriches sur la base d'une moyenne ou d'une hypothèse. Il s'agit de la surface
          occupée par chaque type de sol du site (exprimée en hectare).
        </p>
        <ul>
          {Object.entries(baseSoilsDistribution).map(([type, surfaceArea]) => {
            return (
              <li key={type}>
                {getLabelForSoilType(type as SoilType)} : {formatSoilSurfaceArea(surfaceArea)}
              </li>
            );
          })}
        </ul>
        <ModalTitleThree>Données du projet</ModalTitleThree>
        <p>
          Les données du projet peuvent avoir été saisies par l'utilisateur·ice ou avoir été
          suggérées par Bénéfriches sur la base d'une moyenne ou d'une hypothèse. Il s'agit de la
          surface occupée par chaque type de sol du projet (exprimée en hectare).
        </p>
        <ul>
          {Object.entries(forecastSoilsDistribution).map(([type, surfaceArea]) => {
            return (
              <li key={type}>
                {getLabelForSoilType(type as SoilType)} : {formatSoilSurfaceArea(surfaceArea)}
              </li>
            );
          })}
        </ul>

        <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
        <p>
          La quantité de carbone stockée dans les sols du site (exprimé en kg éq. C) est la somme,
          pour chacun des sols rencontrés sur le site, du produit du stock de référence associé à un
          type de sols (exprimé en kg éq. C/hectare) par la surface occupée par ce type de sol
          (exprimée en hectare).
        </p>
        <ModalTitleTwo>Sources</ModalTitleTwo>
        <ul>
          <li>
            <ExternalLink href="https://aldo-carbone.ademe.fr/">
              Stocks de référence en carbone contenu dans les différents types de sols (ex&nbsp;:
              prairies, forêts, cultures, sols artificialisés) à l'hectare (exprimés en kg éq.
              C/hectare)
            </ExternalLink>
          </li>
        </ul>
        <ModalTitleTwo>Aller plus loin</ModalTitleTwo>
        <ExternalLink href="https://librairie.ademe.fr/recherche-et-innovation/6821-la-sante-des-sols-urbains-au-service-de-l-amenagement-des-villes-et-des-territoires.html">
          ADEME «&nbsp;La santé des sols urbains au service de l'aménagement des villes et des
          territoires&nbsp;», 2024,
        </ExternalLink>
      </ModalContent>
    </ModalBody>
  );
};

export default SoilsCarbonStorageDescription;

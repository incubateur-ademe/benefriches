import { convertSquareMetersToHectares, SoilType } from "shared";

import { ReconversionProjectImpactsResult } from "@/features/projects/application/fetchImpactsForReconversionProject.action";
import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
import { getLabelForSoilType } from "@/shared/core/label-mapping/soilTypeLabelMapping";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import ModalTitleThree from "../ModalTitleThree";
import ModalTitleTwo from "../ModalTitleTwo";

type Props = {
  baseSoilsDistribution: ReconversionProjectImpactsResult["siteData"]["soilsDistribution"];
  forecastSoilsDistribution: ReconversionProjectImpactsResult["projectData"]["soilsDistribution"];
  withMonetarisation: boolean;
};

const formatSoilSurfaceArea = (surfaceArea: number) => {
  return `${formatNumberFr(convertSquareMetersToHectares(surfaceArea))} ha`;
};

const SoilsStorageRelatedCo2Description = ({
  baseSoilsDistribution,
  forecastSoilsDistribution,
  withMonetarisation,
}: Props) => {
  return (
    <>
      <p>
        Le sol, quand il n'a pas été artificialisé, est un milieu vivant, en perpétuel
        renouvellement. Sa création prend plusieurs centaines d'année (pour quelques centimètres de
        sol en conditions naturelles), mais il peut être détruit en quelques secondes (ex : décapage
        de la terre végétale sur 30cm).
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
        {withMonetarisation && <li>Valeur tutélaire du carbone (exprimée en €/t éq. CO2)</li>}
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
        Les données du projet peuvent avoir été saisies par l'utilisateur·ice ou avoir été suggérées
        par Bénéfriches sur la base d'une moyenne ou d'une hypothèse. Il s'agit de la surface
        occupée par chaque type de sol du projet (exprimée en hectare).
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
        (exprimée en hectare). Le changement d'unité kg éq. C en kg éq. CO2 est opéré en multipliant
        la somme obtenue par le ratio 3,67.
      </p>
      {withMonetarisation && (
        <p>
          La monétarisation de cette quantité de carbone stockée dans les sols consiste à multiplier
          le résultat obtenu ci-dessus par la valeur tutélaire du carbone (ou valeur d'action pour
          le climat).
        </p>
      )}
      <ModalTitleTwo>Sources</ModalTitleTwo>
      <ul>
        <li>
          <ExternalLink href="https://aldo-carbone.ademe.fr/">
            Stocks de référence en carbone contenu dans les différents types de sols (ex&nbsp;:
            prairies, forêts, cultures, sols artificialisés) à l'hectare (exprimés en kg éq.
            C/hectare)
          </ExternalLink>
        </li>
        {withMonetarisation && (
          <li>
            <ExternalLink href="https://www.strategie.gouv.fr/sites/strategie.gouv.fr/files/atoms/files/fs-2019-rapport-la-valeur-de-laction-pour-le-climat_0.pdf">
              Valeur tutélaire du carbone
            </ExternalLink>
          </li>
        )}
      </ul>
      <ModalTitleTwo>Aller plus loin</ModalTitleTwo>
      <ExternalLink href="https://librairie.ademe.fr/recherche-et-innovation/6821-la-sante-des-sols-urbains-au-service-de-l-amenagement-des-villes-et-des-territoires.html">
        ADEME «&nbsp;La santé des sols urbains au service de l'aménagement des villes et des
        territoires&nbsp;», 2024,
      </ExternalLink>
    </>
  );
};

export default SoilsStorageRelatedCo2Description;

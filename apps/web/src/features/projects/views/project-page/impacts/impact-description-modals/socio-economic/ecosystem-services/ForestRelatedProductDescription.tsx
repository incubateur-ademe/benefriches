import { convertSquareMetersToHectares, SoilType } from "shared";
import { isForest } from "shared";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import ModalBody from "@/features/projects/views/shared/impacts/modals/ModalBody";
import ModalContent from "@/features/projects/views/shared/impacts/modals/ModalContent";
import ModalHeader from "@/features/projects/views/shared/impacts/modals/ModalHeader";
import ModalTitleThree from "@/features/projects/views/shared/impacts/modals/ModalTitleThree";
import ModalTitleTwo from "@/features/projects/views/shared/impacts/modals/ModalTitleTwo";
import { formatNumberFr } from "@/shared/core/format-number/formatNumber";
import { getLabelForSoilType } from "@/shared/core/label-mapping/soilTypeLabelMapping";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import { breadcrumbSegments } from "./breadcrumbSegments";

type Props = {
  baseSoilsDistribution: { soilType: SoilType; total: number }[];
  forecastSoilsDistribution: { soilType: SoilType; total: number }[];
  impactData?: number;
};

const formatSoilSurfaceArea = (surfaceArea: number) => {
  return `${formatNumberFr(convertSquareMetersToHectares(surfaceArea))} ha`;
};

const ForestRelatedProductDescription = ({
  baseSoilsDistribution,
  forecastSoilsDistribution,
  impactData,
}: Props) => {
  const baseForestSoilsDistribution = baseSoilsDistribution.filter(({ soilType }) =>
    isForest(soilType),
  );
  const forecastForestSoilsDistribution = forecastSoilsDistribution.filter(({ soilType }) =>
    isForest(soilType),
  );
  return (
    <ModalBody size="large">
      <ModalHeader
        title="🪵 Produits issus de la forêt"
        value={
          impactData
            ? {
                state: impactData > 0 ? "success" : "error",
                text: formatMonetaryImpact(impactData),
                description: "pour l'humanité",
              }
            : undefined
        }
        breadcrumbSegments={[...breadcrumbSegments, { label: "Produits issus de la forêt" }]}
      />
      <ModalContent fullWidth>
        <p>
          Parmi les services écosystémiques, les services de production correspondent aux produits
          obtenus directement de l’écosystème tels que la nourriture, le bois, les énergies, les
          ressources génétiques, biochimiques, médicinales.
        </p>
        <p>
          <strong>Bénéficiaire</strong> : humanité
        </p>
        <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
        <ModalTitleThree> Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
        <ul>
          <li>
            Valeur économique du service écosystémique « services d'approvisionnement par les
            forêts” (exprimée en €/ha)
          </li>
        </ul>
        <ModalTitleThree> Données du site</ModalTitleThree>
        <p>
          Les données du site peuvent avoir été saisies par l’utilisateur·ice ou avoir été suggérées
          par Bénéfriches sur la base d’une moyenne ou d’une hypothèse. Il s’agit des éventuelles
          surfaces du site occupées par des forêts (exprimées en hectare).
        </p>
        <ul>
          {baseForestSoilsDistribution.length > 0 ? (
            baseForestSoilsDistribution.map(({ soilType, total }) => {
              return (
                <li key={soilType}>
                  {getLabelForSoilType(soilType)} : {formatSoilSurfaceArea(total)}
                </li>
              );
            })
          ) : (
            <li>Le site ne comporte pas de forêts</li>
          )}
        </ul>

        <ModalTitleThree> Données du projet</ModalTitleThree>
        <p>
          Les données du projet peuvent avoir été saisies par l’utilisateur·ice ou avoir été
          suggérées par Bénéfriches sur la base d’une moyenne ou d’une hypothèse. Il s’agit des
          éventuelles surfaces du projet occupées par des forêts (exprimées en hectare).
        </p>
        <ul>
          {forecastForestSoilsDistribution.length > 0 ? (
            forecastForestSoilsDistribution.map(({ soilType, total }) => {
              return (
                <li key={soilType}>
                  {getLabelForSoilType(soilType)} : {formatSoilSurfaceArea(total)}
                </li>
              );
            })
          ) : (
            <li>Le projet ne comporte pas de forêts</li>
          )}
        </ul>

        <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
        <p>
          La valeur de l’indicateur « produits issus de la forêt » (exprimée en €) est le produit de
          la valeur économique du service écosystémique associée «* services d'approvisionnement par
          les forêts *» (exprimée en €/ha) par la surface de forêt concernée (exprimée en ha).
          L’impact de la réalisation du projet sur le site est la différence entre la valeur de
          l’indicateur calculé pour le projet et celle de l’indicateur calculé pour le site.
        </p>
        <ModalTitleTwo>Sources</ModalTitleTwo>
        <ul>
          <li>
            <ExternalLink href="https://hal.science/hal-03449673/document#:~:text=En%20actualisant%20les%20co%C3%BBts%20de,200%20%E2%82%AC%2Fha%2Fan.">
              Les services écosystémiques des forêts et leur rémunération éventuelle, Revue
              forestière française, 2011
            </ExternalLink>
          </li>
        </ul>
      </ModalContent>
    </ModalBody>
  );
};

export default ForestRelatedProductDescription;

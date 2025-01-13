import { typedObjectEntries } from "shared";
import {
  isPermeableSurfaceWithoutPermanentVegetation,
  isSurfaceWithPermanentVegetation,
  SoilsDistribution,
} from "shared";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";
import { convertSquareMetersToHectares } from "@/shared/services/surface-area/surfaceArea";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import ModalTitleThree from "../../shared/ModalTitleThree";
import ModalTitleTwo from "../../shared/ModalTitleTwo";
import { breadcrumbSegments } from "./breadcrumbSegments";

type Props = {
  baseSoilsDistribution: SoilsDistribution;
  forecastSoilsDistribution: SoilsDistribution;
};

const formatSoilSurfaceArea = (surfaceArea: number) => {
  return `${formatNumberFr(convertSquareMetersToHectares(surfaceArea))} ha`;
};

const WaterCycle = ({ baseSoilsDistribution, forecastSoilsDistribution }: Props) => {
  const baseSoilsWithWaterCycleBenefitsDistributionEntries = typedObjectEntries(
    baseSoilsDistribution,
  ).filter(
    ([key]) =>
      isSurfaceWithPermanentVegetation(key) || isPermeableSurfaceWithoutPermanentVegetation(key),
  );
  const forecastSoilsWithWaterCycleBenefitsDistributionEntries = typedObjectEntries(
    forecastSoilsDistribution,
  ).filter(
    ([key]) =>
      isSurfaceWithPermanentVegetation(key) || isPermeableSurfaceWithoutPermanentVegetation(key),
  );

  return (
    <>
      <ModalHeader
        title="💧 Cycle de l'eau"
        breadcrumbSegments={[...breadcrumbSegments, { label: "Cycle de l'eau" }]}
      />
      <ModalContent>
        <p>
          Les zones naturelles, et dans une moindre mesure les zones agricoles ou les zones
          artificialisées mais non imperméabilisées, ont un apport sur la gestion de l’eau en termes
          de qualité et de flux. Selon les caractéristiques de la zone, le maintien d’une zone
          naturelle ou non imperméabilisé peut permettre d’écrêter les crues, de recharger des
          aquifères ainsi que de purifier l’eau. Le service écosystémique « cycle de l’eau » traite
          de la régulation des flux d’eau.
        </p>
        <p>
          <strong>Bénéficiaire</strong> : collectivité
        </p>
        <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
        <ModalTitleThree> Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
        <ul>
          <li>
            Valeur économique du service écosystémiques « régulation des flux d’eau / risque
            inondation » pour les surfaces avec couverture végétale permanente (exprimée en €/ha)
          </li>
          <li>
            Valeur économique du service écosystémiques « régulation des flux d’eau / risque
            inondation » pour les autres surfaces non imperméabilisées (exprimée en €/ha)
          </li>
        </ul>
        <ModalTitleThree> Données du site</ModalTitleThree>
        <p>
          Les données du site peuvent avoir été saisies par l’utilisateur·ice ou avoir été suggérées
          par Bénéfriches sur la base d’une moyenne ou d’une hypothèse. Il s’agit des éventuelles
          surfaces du site occupées par des prairies, forêts, zones humides, sols artificiels
          arborés, cultures, vergers, vignes, sol enherbé & arbustif ou sol minéral (exprimées en
          hectare).
        </p>
        <ul>
          {baseSoilsWithWaterCycleBenefitsDistributionEntries.length > 0 ? (
            baseSoilsWithWaterCycleBenefitsDistributionEntries.map(([type, surfaceArea]) => {
              return (
                <li key={type}>
                  {getLabelForSoilType(type)} : {formatSoilSurfaceArea(surfaceArea as number)}
                </li>
              );
            })
          ) : (
            <li>Le site ne comporte pas de sols de ces types.</li>
          )}
        </ul>

        <ModalTitleThree> Données du projet</ModalTitleThree>
        <p>
          Les données du projet peuvent avoir été saisies par l’utilisateur·ice ou avoir été
          suggérées par Bénéfriches sur la base d’une moyenne ou d’une hypothèse. Il s’agit des
          éventuelles surfaces du projet occupées par des prairies, forêts, zones humides, sols
          artificiels arborés, cultures, vergers, vignes, sol enherbé & arbustif ou sol minéral
          (exprimées en hectare).
        </p>
        <ul>
          {forecastSoilsWithWaterCycleBenefitsDistributionEntries.length > 0 ? (
            forecastSoilsWithWaterCycleBenefitsDistributionEntries.map(([type, surfaceArea]) => {
              return (
                <li key={type}>
                  {getLabelForSoilType(type)} : {formatSoilSurfaceArea(surfaceArea as number)}
                </li>
              );
            })
          ) : (
            <li>Le projet ne comporte pas de sols de ces types.</li>
          )}
        </ul>

        <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
        <p>
          La valeur de l’indicateur « cycle de l’eau » (exprimée en €) est la somme, pour chaque
          type de sol de type prairies, forêts, zones humides et sols artificiels arborés d’une
          part, et cultures, vergers, vignes, sol enherbé & arbustif ou sol minéral d’autre part, de
          la valeur économique du service écosystémique « régulation des flux d’eau / risque
          inondation » associée à chacun (exprimée en €/ha) multipliée par la surface du type de sol
          concerné (exprimée en ha). L’impact de la réalisation du projet sur le site est la
          différence entre la valeur de l’indicateur calculé pour le projet et celle de l’indicateur
          calculé pour le site.
        </p>
        <ModalTitleTwo>Sources</ModalTitleTwo>
        <ul>
          <li>
            <ExternalLink href="https://www.vie-publique.fr/rapport/30445-approche-economique-de-la-biodiversite-et-services-lies-aux-ecosystemes">
              Approche économique de la biodiversité et des services liés aux écosystèmes, CAS
              (2009)
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://librairie.ademe.fr/sols-pollues/3770-enjeux-de-la-reconversion-d-une-friche-et-comment-evaluer-la-rehabilitation-ecologique-d-un-sol-degrade.html">
              Enjeux de la reconversion d'une friche et comment évaluer la réhabilitation écologique
              d'un sol dégradé - Evaluation des services et des fonctions lors de la restauration
              écologique d'une friche - Projet Biotubes, ADEME (2019)
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.graie.org/graie/graiedoc/doc_telech/Eaux_pluviales_gestion_source_cout_sept18.pdf">
              Comparaison des coûts de différents scénarios de gestion des eaux pluviales, GRAIE
              (2018)
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://hal.inrae.fr/hal-02596502/document">
              Evaluation économique des services rendus par les zones humides, CGDD (2012)
            </ExternalLink>
          </li>
        </ul>
      </ModalContent>
    </>
  );
};

export default WaterCycle;

import { convertSquareMetersToHectares, SoilType } from "shared";
import {
  isPermeableSurfaceWithoutPermanentVegetation,
  isSurfaceWithPermanentVegetation,
} from "shared";

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

const WaterCycle = ({ baseSoilsDistribution, forecastSoilsDistribution, impactData }: Props) => {
  const baseSoilsWithWaterCycleBenefitsDistribution = baseSoilsDistribution.filter(
    ({ soilType }) =>
      isSurfaceWithPermanentVegetation(soilType) ||
      isPermeableSurfaceWithoutPermanentVegetation(soilType),
  );
  const forecastSoilsWithWaterCycleBenefitsDistribution = forecastSoilsDistribution.filter(
    ({ soilType }) =>
      isSurfaceWithPermanentVegetation(soilType) ||
      isPermeableSurfaceWithoutPermanentVegetation(soilType),
  );

  return (
    <ModalBody size="large">
      <ModalHeader
        title="💧 Cycle de l'eau"
        value={
          impactData
            ? {
                state: impactData > 0 ? "success" : "error",
                text: formatMonetaryImpact(impactData),
                description: "pour l'humanité",
              }
            : undefined
        }
        breadcrumbSegments={[...breadcrumbSegments, { label: "Cycle de l'eau" }]}
      />
      <ModalContent fullWidth>
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
          {baseSoilsWithWaterCycleBenefitsDistribution.length > 0 ? (
            baseSoilsWithWaterCycleBenefitsDistribution.map(({ soilType, total }) => {
              return (
                <li key={soilType}>
                  {getLabelForSoilType(soilType)} : {formatSoilSurfaceArea(total)}
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
          {forecastSoilsWithWaterCycleBenefitsDistribution.length > 0 ? (
            forecastSoilsWithWaterCycleBenefitsDistribution.map(({ soilType, total }) => {
              return (
                <li key={soilType}>
                  {getLabelForSoilType(soilType)} : {formatSoilSurfaceArea(total)}
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
    </ModalBody>
  );
};

export default WaterCycle;

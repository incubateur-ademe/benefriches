import { convertSquareMetersToHectares, isPrairie, isWetLand, SoilType } from "shared";

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

const NitrogenCycleDescription = ({
  baseSoilsDistribution,
  forecastSoilsDistribution,
  impactData,
}: Props) => {
  const baseSoilsWithNitrogenCycleBenefitsDistribution = baseSoilsDistribution.filter(
    ({ soilType }) => isPrairie(soilType) || isWetLand(soilType),
  );
  const forecastSoilsWithNitrogenCycleBenefitsDistribution = forecastSoilsDistribution.filter(
    ({ soilType }) => isPrairie(soilType) || isWetLand(soilType),
  );

  return (
    <ModalBody size="large">
      <ModalHeader
        title="🍄 Cycle de l'azote"
        value={
          impactData
            ? {
                state: impactData > 0 ? "success" : "error",
                text: formatMonetaryImpact(impactData),
                description: "pour l'humanité",
              }
            : undefined
        }
        breadcrumbSegments={[...breadcrumbSegments, { label: "Cycle de l'azote" }]}
      />
      <ModalContent fullWidth>
        <p>
          Les zones naturelles telles que les prairies et les zones humides ont un apport sur la
          dénitrification des sols et eaux souterraines, réduisant les quantités de nitrates
          dégradant la qualité des eaux et à l’origine du phénomène des algues vertes. Le service
          écosystémique « cycle de l’azote » traite de la régulation des flux d’azote dans
          l’environnement.
        </p>
        <p>
          <strong>Bénéficiaire</strong> : humanité
        </p>
        <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
        <ModalTitleThree> Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
        <ul>
          <li>
            Valeur économique du service écosystémiques « cycle de l’azote » pour les prairies
            (exprimée en €/ha)
          </li>
          <li>
            Valeur économique du service écosystémiques « cycle de l’azote » pour les zones humides
            (exprimée en €/ha)
          </li>
        </ul>
        <ModalTitleThree> Données du site</ModalTitleThree>
        <p>
          Les données du site peuvent avoir été saisies par l’utilisateur·ice ou avoir été suggérées
          par Bénéfriches sur la base d’une moyenne ou d’une hypothèse. Il s’agit des éventuelles
          surfaces du site occupées par des prairies ou des zones humides (exprimées en hectare).
        </p>
        <ul>
          {baseSoilsWithNitrogenCycleBenefitsDistribution.length > 0 ? (
            baseSoilsWithNitrogenCycleBenefitsDistribution.map(({ soilType, total }) => {
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
          éventuelles surfaces du projet occupées par des prairies ou des zones humides (exprimées
          en hectare).
        </p>
        <ul>
          {forecastSoilsWithNitrogenCycleBenefitsDistribution.length > 0 ? (
            forecastSoilsWithNitrogenCycleBenefitsDistribution.map(({ total, soilType }) => {
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
          La valeur de l’indicateur « cycle de l’azote » (exprimée en €) est la somme, pour chaque
          type de sol de type « praires » et « zones humides » de la valeur économique du service
          écosystémique « cycle de l’azote » associée à chacun (exprimée en €/ha) multipliée par la
          surface du type de sol concerné (exprimée en ha). L’impact de la réalisation du projet sur
          le site est la différence entre la valeur de l’indicateur calculé pour le projet et celle
          de l’indicateur calculé pour le site.
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
            <ExternalLink href="https://side.developpement-durable.gouv.fr/ARHA/doc/SYRACUSE/267661/avancees-et-enseignements-pour-la-valorisation-des-services-rendus-par-les-zones-humides">
              Avancées et enseignements pour la valorisation des services rendus par les zones
              humides, CGDD (2013)
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://www.eionet.europa.eu/etcs/etc-bd/products/etc-bd-reports/survey_on_grassland_ecosystem_services_cz">
              Survey on grassland ecosystem services in the Czech Republic and literature review -
              ETC/BD Technical paper N°1/2011 (2011)
            </ExternalLink>
          </li>
        </ul>
      </ModalContent>
    </ModalBody>
  );
};

export default NitrogenCycleDescription;

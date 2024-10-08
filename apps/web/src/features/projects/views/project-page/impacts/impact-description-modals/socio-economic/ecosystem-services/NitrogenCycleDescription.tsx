import { isPrairie, isWetLand, SoilsDistribution, typedObjectEntries } from "shared";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";
import { convertSquareMetersToHectares } from "@/shared/services/surface-area/surfaceArea";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import ModalTitleThree from "../../shared/ModalTitleThree";
import ModalTitleTwo from "../../shared/ModalTitleTwo";

type Props = {
  baseSoilsDistribution: SoilsDistribution;
  forecastSoilsDistribution: SoilsDistribution;
};

const formatSoilSurfaceArea = (surfaceArea: number) => {
  return `${formatNumberFr(convertSquareMetersToHectares(surfaceArea))} ha`;
};

const NitrogenCycleDescription = ({ baseSoilsDistribution, forecastSoilsDistribution }: Props) => {
  const baseSoilsWithNitrogenCycleBenefitsDistributionEntries = typedObjectEntries(
    baseSoilsDistribution,
  ).filter(([key]) => isPrairie(key) || isWetLand(key));
  const forecastSoilsWithNitrogenCycleBenefitsDistributionEntries = typedObjectEntries(
    forecastSoilsDistribution,
  ).filter(([key]) => isPrairie(key) || isWetLand(key));

  return (
    <>
      <p>
        Les zones naturelles telles que les prairies et les zones humides ont un apport sur la
        dénitrification des sols et eaux souterraines, réduisant les quantités de nitrates dégradant
        la qualité des eaux et à l’origine du phénomène des algues vertes. Le service écosystémique
        « cycle de l’azote » traite de la régulation des flux d’azote dans l’environnement.
      </p>
      <p>
        <strong>Bénéficiaire</strong> : société humaine
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
        {baseSoilsWithNitrogenCycleBenefitsDistributionEntries.length > 0 ? (
          baseSoilsWithNitrogenCycleBenefitsDistributionEntries.map(([type, surfaceArea]) => {
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
        Les données du projet peuvent avoir été saisies par l’utilisateur·ice ou avoir été suggérées
        par Bénéfriches sur la base d’une moyenne ou d’une hypothèse. Il s’agit des éventuelles
        surfaces du projet occupées par des prairies ou des zones humides (exprimées en hectare).
      </p>
      <ul>
        {forecastSoilsWithNitrogenCycleBenefitsDistributionEntries.length > 0 ? (
          forecastSoilsWithNitrogenCycleBenefitsDistributionEntries.map(([type, surfaceArea]) => {
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
        La valeur de l’indicateur « cycle de l’azote » (exprimée en €) est la somme, pour chaque
        type de sol de type « praires » et « zones humides » de la valeur économique du service
        écosystémique « cycle de l’azote » associée à chacun (exprimée en €/ha) multipliée par la
        surface du type de sol concerné (exprimée en ha). L’impact de la réalisation du projet sur
        le site est la différence entre la valeur de l’indicateur calculé pour le projet et celle de
        l’indicateur calculé pour le site.
      </p>
      <ModalTitleTwo>Sources</ModalTitleTwo>
      <ul>
        <li>
          <ExternalLink href="https://www.vie-publique.fr/rapport/30445-approche-economique-de-la-biodiversite-et-services-lies-aux-ecosystemes">
            Approche économique de la biodiversité et des services liés aux écosystèmes, CAS (2009)
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
    </>
  );
};

export default NitrogenCycleDescription;

import ModalTitleThree from "../../shared/ModalTitleThree";
import ModalTitleTwo from "../../shared/ModalTitleTwo";

import { ReconversionProjectImpactsResult } from "@/features/projects/application/fetchReconversionProjectImpacts.action";
import { isForestPrairieOrWetLand, SoilType } from "@/shared/domain/soils";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";
import { convertSquareMetersToHectares } from "@/shared/services/surface-area/surfaceArea";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

type Props = {
  baseSoilsDistribution: ReconversionProjectImpactsResult["siteData"]["soilsDistribution"];
  forecastSoilsDistribution: ReconversionProjectImpactsResult["projectData"]["soilsDistribution"];
};

const formatSoilSurfaceArea = (surfaceArea: number) => {
  return `${formatNumberFr(convertSquareMetersToHectares(surfaceArea))} ha`;
};

const NatureRelatedWellnessAndLeisureDescription = ({
  baseSoilsDistribution,
  forecastSoilsDistribution,
}: Props) => {
  const baseSoilsWithBenefitsDistributionEntries = Object.entries(baseSoilsDistribution).filter(
    ([key]) => isForestPrairieOrWetLand(key as SoilType),
  );
  const forecastSoilsWithBenefitsDistributionEntries = Object.entries(
    forecastSoilsDistribution,
  ).filter(([key]) => isForestPrairieOrWetLand(key as SoilType));
  return (
    <>
      <p>
        Les zones naturelles et forestières ou encore les prairies favorisent la biodiversité et
        constituent des zones pour lesquelles les citoyens ont un attachement à leur préservation.
        L'approche socio-économique permet de définir des valeurs d'usage, monétarisées, de services
        écosystémiques liés à la biodiversité générale pour ces différentes zones.
      </p>
      <p>
        <strong>Bénéficiaire</strong> : société humaine
      </p>
      <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
      <ModalTitleThree> Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
      <ul>
        <li>
          Valeur économique des services écosystémiques rendus par les prairies (hors cycles du
          carbone, de l'azote et de l'eau, régulation de la qualité de l'eau et maintien de la
          biodiversité) (exprimée en €/ha).
        </li>
        <li>
          Valeur économique des services écosystémiques rendus par les forêts (hors cycles du
          carbone, de l'azote et de l'eau, régulation de la qualité de l'eau, produits issus de la
          forêt et maintien de la biodiversité) (exprimée en €/ha).
        </li>
        <li>
          Valeur économique des services écosystémiques rendus par les zones humides (hors cycles du
          carbone, de l'azote et de l'eau, régulation de la qualité de l'eau et maintien de la
          biodiversité) (exprimée en €/ha).
        </li>
      </ul>
      <ModalTitleThree> Données du site</ModalTitleThree>
      <p>
        Les données du site peuvent avoir été saisies par l'utilisateur·ice ou avoir été suggérées
        par Bénéfriches sur la base d'une moyenne ou d'une hypothèse. Il s'agit des éventuelles
        surfaces du site occupées (i) par des prairies, (ii) par des forêts et (iii) par des zones
        humides (exprimées en hectare).
      </p>
      <ul>
        {baseSoilsWithBenefitsDistributionEntries.length > 0 ? (
          baseSoilsWithBenefitsDistributionEntries.map(([type, surfaceArea]) => {
            return (
              <li key={type}>
                {getLabelForSoilType(type as SoilType)} : {formatSoilSurfaceArea(surfaceArea)}
              </li>
            );
          })
        ) : (
          <li>Le site ne comporte pas de prairie, forêt ou zone humide</li>
        )}
      </ul>

      <ModalTitleThree> Données du projet</ModalTitleThree>
      <p>
        Les données du projet peuvent avoir été saisies par l'utilisateur·ice ou avoir été suggérées
        par Bénéfriches sur la base d'une moyenne ou d'une hypothèse. Il s'agit des éventuelles
        surfaces du site occupées (i) par des prairies, (ii) par des forêts et (iii) par des zones
        humides (exprimées en hectare).
      </p>
      <ul>
        {forecastSoilsWithBenefitsDistributionEntries.length > 0 ? (
          forecastSoilsWithBenefitsDistributionEntries.map(([type, surfaceArea]) => {
            return (
              <li key={type}>
                {getLabelForSoilType(type as SoilType)} : {formatSoilSurfaceArea(surfaceArea)}
              </li>
            );
          })
        ) : (
          <li>Le projet ne comporte pas de prairie, forêt ou zone humide</li>
        )}
      </ul>

      <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
      <p>
        La valeur de l'indicateur « Loisirs et bien-être liés à la nature » (exprimée en €) est la
        somme, pour chaque type de sol de type « prairies », « forêts » ou « zones humides » de la
        valeur économique des services écosystémiques associée à chacun (exprimée en €/ha)
        multipliée par la surface du type de sol concerné (exprimée en ha). L'impact de la
        réalisation du projet sur le site est la différence entre la valeur de l'indicateur calculé
        pour le projet et celle de l'indicateur calculé pour le site.
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
          <ExternalLink href="https://hal.science/hal-03449673/">
            Les services écosystémiques des forêts et leur rémunération éventuelle, Revue forestière
            française (2011)
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

export default NatureRelatedWellnessAndLeisureDescription;

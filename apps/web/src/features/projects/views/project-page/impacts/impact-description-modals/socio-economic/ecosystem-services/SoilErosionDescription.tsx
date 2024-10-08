import { typedObjectEntries } from "shared";
import { isSurfaceWithEcosystemBenefits, SoilsDistribution } from "shared";

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

const SoilErosionDescription = ({ baseSoilsDistribution, forecastSoilsDistribution }: Props) => {
  const baseSoilsWithBenefitsDistributionEntries = typedObjectEntries(baseSoilsDistribution).filter(
    ([key]) => isSurfaceWithEcosystemBenefits(key),
  );
  const forecastSoilsWithBenefitsDistributionEntries = typedObjectEntries(
    forecastSoilsDistribution,
  ).filter(([key]) => isSurfaceWithEcosystemBenefits(key));
  return (
    <>
      <p>
        L’érosion est un phénomène naturel qui résulte de l’ablation des couches superficielles du
        sol et du déplacement des matériaux le constituant, ****sous l’action notamment de l’eau ou
        du vent. Parmi ses conséquences : la réduction de l’aptitude à la végétalisation ou
        l’accroissement du ruissellement, La présence de surfaces avec couverture végétale
        permanente est de nature à réduire les risques d’érosion.
      </p>
      <p>
        <strong>Bénéficiaire</strong> : société humaine
      </p>
      <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
      <ModalTitleThree> Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
      <ul>
        <li>
          Valeur économique du service écosystémiques « régulation de l’érosion des sols » pour les
          prairies (exprimée en €/ha)
        </li>
      </ul>
      <ModalTitleThree> Données du site</ModalTitleThree>
      <p>
        Les données du site peuvent avoir été saisies par l’utilisateur·ice ou avoir été suggérées
        par Bénéfriches sur la base d’une moyenne ou d’une hypothèse. Il s’agit des éventuelles
        surfaces du site occupées par des prairies, forêts, zones humides ou sols artificiels
        arborés (exprimées en hectare).
      </p>
      <ul>
        {baseSoilsWithBenefitsDistributionEntries.length > 0 ? (
          baseSoilsWithBenefitsDistributionEntries.map(([type, surfaceArea]) => {
            return (
              <li key={type}>
                {getLabelForSoilType(type)} : {formatSoilSurfaceArea(surfaceArea as number)}
              </li>
            );
          })
        ) : (
          <li>Le site ne comporte pas de prairie, forêt, zone humide ou sol artificiel arboré.</li>
        )}
      </ul>

      <ModalTitleThree> Données du projet</ModalTitleThree>
      <p>
        Les données du projet peuvent avoir été saisies par l’utilisateur·ice ou avoir été suggérées
        par Bénéfriches sur la base d’une moyenne ou d’une hypothèse. Il s’agit des éventuelles
        surfaces du projet occupées par des prairies, forêts, zones humides ou sols artificiels
        arborés (exprimées en hectare).
      </p>
      <ul>
        {forecastSoilsWithBenefitsDistributionEntries.length > 0 ? (
          forecastSoilsWithBenefitsDistributionEntries.map(([type, surfaceArea]) => {
            return (
              <li key={type}>
                {getLabelForSoilType(type)} : {formatSoilSurfaceArea(surfaceArea as number)}
              </li>
            );
          })
        ) : (
          <li>Le projet ne comporte pas de prairie, forêt, zone humide ou sol artificiel arboré</li>
        )}
      </ul>

      <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
      <p>
        La valeur de l’indicateur « régulation de l’érosion des sols » (exprimée en €) est la somme,
        pour chaque type de sol de type « praires », « forêts », « zones humides » ou « sols
        artificiels arborés » de la valeur économique du service écosystémique associée « régulation
        de l’érosion des sols » (exprimée en €/ha) multipliée par la surface du type de sol concerné
        (exprimée en ha). L’impact de la réalisation du projet sur le site est la différence entre
        la valeur de l’indicateur calculé pour le projet et celle de l’indicateur calculé pour le
        site.
      </p>
      <ModalTitleTwo>Sources</ModalTitleTwo>
      <ul>
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

export default SoilErosionDescription;

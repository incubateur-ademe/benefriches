import ModalTitleThree from "../ModalTitleThree";
import ModalTitleTwo from "../ModalTitleTwo";

import { ReconversionProjectImpactsResult } from "@/features/projects/application/fetchReconversionProjectImpacts.action";
import { isForestPrairieOrWetLand, SoilType } from "@/shared/domain/soils";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";
import { convertSquareMetersToHectares } from "@/shared/services/surface-area/surfaceArea";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

type Props = {
  baseSoilsDistribution: ReconversionProjectImpactsResult["siteData"]["soilsDistribution"];
  forecastSoilsDistribution: ReconversionProjectImpactsResult["projectData"]["soilsDistribution"];
  baseContaminatedSurface: number;
  forecastContaminatedSurface: number;
};

const formatSoilSurfaceArea = (surfaceArea: number) => {
  return `${formatNumberFr(convertSquareMetersToHectares(surfaceArea))} ha`;
};

const WaterRegulationDescription = ({
  baseSoilsDistribution,
  forecastSoilsDistribution,
  baseContaminatedSurface,
  forecastContaminatedSurface,
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
        Les friches sont bien souvent concernées par des pollutions des sols, vestiges des activités
        passées. Il peut en résulter des impacts sur les eaux souterraines, à savoir une dégradation
        de la qualité de l’eau. L’impact, indirect, retenu dans Bénéfriches est le besoin
        d’épuration des eaux s’infiltrant sur la friche en vue d’en améliorer la qualité.
      </p>
      <p>
        <strong>Bénéficiaire</strong> : société humaine
      </p>
      <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
      <ModalTitleThree> Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
      <ul>
        <li>Valeur économique d’épuration des eaux souterraines (exprimée en €/ha).</li>
      </ul>
      <ModalTitleThree> Données du site</ModalTitleThree>
      <p>
        Les données du site peuvent avoir été saisies par l’utilisateur·ice ou avoir été suggérées
        par Bénéfriches sur la base d’une moyenne ou d’une hypothèse. Il s’agit de la surface
        polluée du site (exprimée en hectare) et des éventuelles surfaces du site occupées (i) par
        des prairies, (ii) par des forêts et (iii) par des zones humides (exprimées en hectare).
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
        <li>Surface polluée : {formatSoilSurfaceArea(baseContaminatedSurface)}</li>
      </ul>
      <ModalTitleThree> Données du projet</ModalTitleThree>
      <p>
        Les données du projet peuvent avoir été saisies par l’utilisateur·ice ou avoir été suggérées
        par Bénéfriches sur la base d’une moyenne ou d’une hypothèse. Il s’agit de la surface
        polluée résiduelle après remise en état (exprimée en hectare) et des éventuelles surfaces du
        site occupées (i) par des prairies, (ii) par des forêts et (iii) par des zones humides
        (exprimées en hectare).
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
        <li>Surface polluée : {formatSoilSurfaceArea(forecastContaminatedSurface)}</li>
      </ul>
      <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
      <p>
        La valeur de l’indicateur « Régulation de la qualité de l’eau » (exprimée en €) est la
        somme, pour chaque type de sol de type « prairies », « forêts » ou « zones humides » de la
        valeur économique d’épuration des eaux souterraines multipliée par la surface du type de sol
        concerné (exprimée en ha) et de la monétarisation du besoin en épuration des eaux
        souterraines des surfaces dépolluée du site.
      </p>
      <p>
        La monétarisation du besoin en épuration des eaux souterraines lié à la dépollution du site
        (exprimée en €) est le produit de la surface dépolluée par la valeur économique d’épuration
        des eaux souterraines (exprimée en ha).
      </p>
      <p>
        La surface dépolluée est la différence entre la surface polluée résiduelle après dépollution
        (projet) et la surface polluée initialement présente (site).
      </p>
      <p>
        La surface dépolluée est la différence entre la surface polluée résiduelle après dépollution
        (projet) et la surface polluée initialement présente (site).
      </p>
      <ModalTitleTwo>Sources</ModalTitleTwo>
      <ExternalLink href="https://www.vie-publique.fr/rapport/30445-approche-economique-de-la-biodiversite-et-services-lies-aux-ecosystemes">
        Approche économique de la biodiversité et des services liés aux écosystèmes, CAS (2009)
      </ExternalLink>
    </>
  );
};

export default WaterRegulationDescription;

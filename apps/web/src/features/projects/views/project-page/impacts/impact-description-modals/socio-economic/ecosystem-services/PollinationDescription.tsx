import { typedObjectEntries } from "shared";
import { isSurfaceWithEcosystemBenefits, SoilsDistribution } from "shared";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";
import { convertSquareMetersToHectares } from "@/shared/services/surface-area/surfaceArea";
import ExternalLink from "@/shared/views/components/ExternalLink/ExternalLink";

import ModalContent from "../../shared/ModalContent";
import ModalHeader from "../../shared/ModalHeader";
import ModalTitleThree from "../../shared/ModalTitleThree";
import ModalTitleTwo from "../../shared/ModalTitleTwo";

type Props = {
  baseSoilsDistribution: SoilsDistribution;
  forecastSoilsDistribution: SoilsDistribution;
};

const formatSoilSurfaceArea = (surfaceArea: number) => {
  return `${formatNumberFr(convertSquareMetersToHectares(surfaceArea))} ha`;
};

const PollinationDescription = ({ baseSoilsDistribution, forecastSoilsDistribution }: Props) => {
  const baseSoilsWithBenefitsDistributionEntries = typedObjectEntries(baseSoilsDistribution).filter(
    ([key]) => isSurfaceWithEcosystemBenefits(key),
  );
  const forecastSoilsWithBenefitsDistributionEntries = typedObjectEntries(
    forecastSoilsDistribution,
  ).filter(([key]) => isSurfaceWithEcosystemBenefits(key));
  return (
    <>
      <ModalHeader
        title="🐝 Pollinisation"
        breadcrumbSegments={[
          {
            label: "Impacts socio-économiques",
            id: "socio-economic",
          },
          {
            label: "Impacts environnementaux monétarisés",
          },
          {
            label: "Services écosystémiques",
            id: "socio-economic.ecosystem-services",
          },
          { label: "Pollinisation" },
        ]}
      />
      <ModalContent>
        <p>
          Les pollinisateurs jouent un rôle crucial dans la production alimentaire, un nombre
          important de cultures dépendant d’une manière ou d’une autre de la pollinisation animale.
          Le maintien d’espaces naturels, voire même d’espaces artificiels arborés et la
          renaturation favorisent la pollinisation. L’approche socio-économique permet de définir
          des valeurs d’usage, monétarisées, de ce service écosystémique qu’est la pollinisation.
        </p>
        <p>
          <strong>Bénéficiaire</strong> : humanité
        </p>
        <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
        <ModalTitleThree> Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
        <ul>
          <li>Valeur économique du service écosystémique « pollinisation » (exprimée en €/ha)</li>
        </ul>
        <ModalTitleThree> Données du site</ModalTitleThree>
        <p>
          Les données du site peuvent avoir été saisies par l’utilisateur·ice ou avoir été suggérées
          par Bénéfriches sur la base d’une moyenne ou d’une hypothèse. Il s’agit des éventuelles
          surfaces du site occupées par des (i) prairies, (ii) forêts, (iii) zones humides et (iv)
          sols artificiels arborés (exprimées en hectare).
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
            <li>
              Le site ne comporte pas de prairie, forêt, zone humide ou sol artificiel arboré.
            </li>
          )}
        </ul>

        <ModalTitleThree> Données du projet</ModalTitleThree>
        <p>
          Les données du projet peuvent avoir été saisies par l’utilisateur·ice ou avoir été
          suggérées par Bénéfriches sur la base d’une moyenne ou d’une hypothèse. Il s’agit des
          éventuelles surfaces du site occupées par des (i) prairies, (ii) forêts, (iii) zones
          humides et (iv) sols artificiels arborés (exprimées en hectare).
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
            <li>
              Le projet ne comporte pas de prairie, forêt, zone humide ou sol artificiel arboré
            </li>
          )}
        </ul>

        <ModalTitleTwo>Comment est fait le calcul ?</ModalTitleTwo>
        <p>
          La valeur de l’indicateur « pollinisation » (exprimée en €) est la somme, pour chaque type
          de sol de type « praires », « forêts », « zones humides » ou « sols artificiels arborés »
          de la valeur économique du service écosystémique associée « pollinisation » (exprimée en
          €/ha) multipliée par la surface du type de sol concerné (exprimée en ha). L’impact de la
          réalisation du projet sur le site est la différence entre la valeur de l’indicateur
          calculé pour le projet et celle de l’indicateur calculé pour le site.
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
            <ExternalLink href="https://temis.documentation.developpement-durable.gouv.fr/document.html?id=Temis-0085507">
              Le service de pollinisation, EFESE, Commissariat général au développement durable
              (2016)
            </ExternalLink>
          </li>
        </ul>
      </ModalContent>
    </>
  );
};

export default PollinationDescription;

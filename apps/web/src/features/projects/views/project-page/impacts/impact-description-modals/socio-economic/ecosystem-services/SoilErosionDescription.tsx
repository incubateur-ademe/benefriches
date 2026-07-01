import { convertSquareMetersToHectares, SoilType } from "shared";
import { isSurfaceWithEcosystemBenefits } from "shared";

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

const SoilErosionDescription = ({
  baseSoilsDistribution,
  forecastSoilsDistribution,
  impactData,
}: Props) => {
  const baseSoilsWithBenefitsDistribution = baseSoilsDistribution.filter(({ soilType }) =>
    isSurfaceWithEcosystemBenefits(soilType),
  );
  const forecastSoilsWithBenefitsDistribution = forecastSoilsDistribution.filter(({ soilType }) =>
    isSurfaceWithEcosystemBenefits(soilType),
  );
  return (
    <ModalBody size="large">
      <ModalHeader
        title="🌾 Régulation de l'érosion des sols"
        value={
          impactData
            ? {
                state: impactData > 0 ? "success" : "error",
                text: formatMonetaryImpact(impactData),
                description: "pour l'humanité",
              }
            : undefined
        }
        breadcrumbSegments={[...breadcrumbSegments, { label: "Régulation de l'érosion des sols" }]}
      />
      <ModalContent fullWidth>
        <p>
          L’érosion est un phénomène naturel qui résulte de l’ablation des couches superficielles du
          sol et du déplacement des matériaux le constituant, ****sous l’action notamment de l’eau
          ou du vent. Parmi ses conséquences : la réduction de l’aptitude à la végétalisation ou
          l’accroissement du ruissellement, La présence de surfaces avec couverture végétale
          permanente est de nature à réduire les risques d’érosion.
        </p>
        <p>
          <strong>Bénéficiaire</strong> : humanité
        </p>
        <ModalTitleTwo>Quelles données sont utilisées dans le calcul ?</ModalTitleTwo>
        <ModalTitleThree> Données systémiques agrégées par Bénéfriches :</ModalTitleThree>
        <ul>
          <li>
            Valeur économique du service écosystémiques « régulation de l’érosion des sols » pour
            les prairies (exprimée en €/ha)
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
          {baseSoilsWithBenefitsDistribution.length > 0 ? (
            baseSoilsWithBenefitsDistribution.map(({ soilType, total }) => {
              return (
                <li key={soilType}>
                  {getLabelForSoilType(soilType)} : {formatSoilSurfaceArea(total)}
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
          éventuelles surfaces du projet occupées par des prairies, forêts, zones humides ou sols
          artificiels arborés (exprimées en hectare).
        </p>
        <ul>
          {forecastSoilsWithBenefitsDistribution.length > 0 ? (
            forecastSoilsWithBenefitsDistribution.map(({ soilType, total }) => {
              return (
                <li key={soilType}>
                  {getLabelForSoilType(soilType)} : {formatSoilSurfaceArea(total)}
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
          La valeur de l’indicateur « régulation de l’érosion des sols » (exprimée en €) est la
          somme, pour chaque type de sol de type « praires », « forêts », « zones humides » ou «
          sols artificiels arborés » de la valeur économique du service écosystémique associée «
          régulation de l’érosion des sols » (exprimée en €/ha) multipliée par la surface du type de
          sol concerné (exprimée en ha). L’impact de la réalisation du projet sur le site est la
          différence entre la valeur de l’indicateur calculé pour le projet et celle de l’indicateur
          calculé pour le site.
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
      </ModalContent>
    </ModalBody>
  );
};

export default SoilErosionDescription;

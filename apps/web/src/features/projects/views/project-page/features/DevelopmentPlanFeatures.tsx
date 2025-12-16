import { roundToInteger, sumListWithKey, sumObjectValues } from "shared";

import { ProjectFeatures } from "@/features/projects/domain/projects.types";
import {
  formatNumberFr,
  formatPercentage,
  formatSurfaceArea,
} from "@/shared/core/format-number/formatNumber";
import { computePercentage } from "@/shared/core/percentage/percentage";
import {
  getUrbanSpaceLabelForLivingAndActivitySpace,
  getUrbanSpaceLabelForPublicSpace,
} from "@/shared/core/urbanProject";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";

import {
  getLabelForUrbanProjectCategory,
  getUrbanProjectCategoryFromFeatures,
} from "../../shared/urbanProjectCategory";
import SoilsDistribution from "./SoilsDistribution";
import UrbanProjectBuildingsSection from "./UrbanProjectBuildingsSection";

type Props = Omit<ProjectFeatures, "id">;

const DevelopmentPlanFeatures = ({
  developmentPlan,
  decontaminatedSoilSurface,
  soilsDistribution,
  isExpress,
}: Props) => {
  switch (developmentPlan.type) {
    case "PHOTOVOLTAIC_POWER_PLANT":
      return (
        <>
          <Section title="⚙️ Paramètres du projet">
            <DataLine
              label={<strong>Puissance d'installation</strong>}
              value={`${formatNumberFr(developmentPlan.electricalPowerKWc)} kWc`}
            />
            <DataLine
              label={<strong>Superficie occupée par les panneaux</strong>}
              value={formatSurfaceArea(roundToInteger(developmentPlan.surfaceArea))}
            />
            <DataLine
              label={<strong>Production annuelle attendue</strong>}
              value={`${formatNumberFr(developmentPlan.expectedAnnualProduction)} MWh / an`}
            />
            <DataLine
              label={<strong>Durée du contrat de revente d'énergie</strong>}
              value={`${formatNumberFr(developmentPlan.contractDuration)} ans`}
            />
          </Section>
          <Section title="🌾 Transformation des sols">
            {decontaminatedSoilSurface ? (
              <DataLine
                label="Surface dépolluée"
                value={formatSurfaceArea(roundToInteger(decontaminatedSoilSurface))}
              />
            ) : null}
            <SoilsDistribution
              isExpressProject={isExpress}
              projectType="PHOTOVOLTAIC_POWER_PLANT"
              soilsDistribution={soilsDistribution}
            />
          </Section>
        </>
      );
    case "URBAN_PROJECT": {
      const { buildingsFloorAreaDistribution } = developmentPlan;

      const livingAndActivitiesSpaces = soilsDistribution.filter(
        ({ spaceCategory }) => spaceCategory === "LIVING_AND_ACTIVITY_SPACE",
      );

      const totalGrassPublicSpaces =
        soilsDistribution.find(
          ({ spaceCategory, soilType }) =>
            spaceCategory === "PUBLIC_SPACE" && soilType === "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
        )?.surfaceArea ?? 0;

      const otherPublicSpaces = soilsDistribution.filter(
        ({ spaceCategory, soilType }) =>
          spaceCategory === "PUBLIC_SPACE" && soilType !== "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      );

      const totalPublicGreenSpaces = sumListWithKey(
        soilsDistribution.filter(({ spaceCategory }) => spaceCategory === "PUBLIC_GREEN_SPACE"),
        "surfaceArea",
      );

      const totalLivingAndActivitiesSpaces = sumListWithKey(
        livingAndActivitiesSpaces,
        "surfaceArea",
      );
      const totalPublicGreenSpacesAndPublicGrassSpaces =
        totalGrassPublicSpaces + totalPublicGreenSpaces;
      const totalOtherPublicSpaces = sumListWithKey(otherPublicSpaces, "surfaceArea");

      const totalSurfaceArea = sumListWithKey(soilsDistribution, "surfaceArea");

      const urbanProjectCategory = getUrbanProjectCategoryFromFeatures({
        buildingsUseDistribution: buildingsFloorAreaDistribution,
        soilsDistribution,
      });

      const urbanProjectCategoryLabel = getLabelForUrbanProjectCategory(urbanProjectCategory);

      return (
        <>
          <Section title="🏘️ Espaces">
            <DataLine
              label={<strong>Superficie du site</strong>}
              value={<strong>{formatSurfaceArea(roundToInteger(totalSurfaceArea))}</strong>}
            />
            {totalLivingAndActivitiesSpaces > 0 && (
              <DataLine
                label="Lieux d'habitation et d’activité"
                labelTooltip="Les lieux d'habitation et d’activité regroupent les lots dédiés aux logements, aux activités économiques, les emprises des équipements publics, en dehors des espaces verts publics et autres espaces publics de type rues, places, parking…"
                value={formatSurfaceArea(roundToInteger(totalLivingAndActivitiesSpaces))}
                valueTooltip={
                  isExpress
                    ? `On considère que les lieux d'habitation et d’activité occupent ${formatPercentage(computePercentage(totalLivingAndActivitiesSpaces, totalSurfaceArea))} de la surface du site ; fonction du type de projet « ${urbanProjectCategoryLabel} ». Cette valeur est issue du retour d’expérience ADEME.`
                    : undefined
                }
              />
            )}
            {totalOtherPublicSpaces > 0 && (
              <DataLine
                label="Espaces publics"
                value={formatSurfaceArea(roundToInteger(totalOtherPublicSpaces))}
                valueTooltip={
                  isExpress
                    ? `On considère que les espaces publics occupent ${formatPercentage(computePercentage(totalOtherPublicSpaces, totalSurfaceArea))} de la surface du site ; fonction du type de projet « ${urbanProjectCategoryLabel} ». Cette valeur est issue du retour d’expérience ADEME.`
                    : undefined
                }
              />
            )}
            {totalPublicGreenSpacesAndPublicGrassSpaces > 0 && (
              <DataLine
                label="Espaces verts publics"
                labelTooltip="Il s’agit des espaces verts publics (parcs, jardins, forêt urbaines, alignements d’arbres, noues, etc.)."
                valueTooltip={
                  isExpress
                    ? `On considère que les espaces verts occupent ${formatPercentage(computePercentage(totalPublicGreenSpacesAndPublicGrassSpaces, totalSurfaceArea))} de la surface du site ; fonction du type de projet « ${urbanProjectCategoryLabel} ». Cette valeur est issue du retour d’expérience ADEME.`
                    : undefined
                }
                value={formatSurfaceArea(
                  roundToInteger(totalPublicGreenSpacesAndPublicGrassSpaces),
                )}
              />
            )}
          </Section>
          {decontaminatedSoilSurface ? (
            <Section
              title="✨ Dépollution"
              tooltip="Les sols de la friche nécessitent une dépollution pour permettre la réalisation du projet. La pollution à l’amiante des bâtiments n’est pas considérée ici."
            >
              {decontaminatedSoilSurface ? (
                <DataLine
                  label="Surface dépolluée"
                  value={formatSurfaceArea(roundToInteger(decontaminatedSoilSurface))}
                  valueTooltip={
                    isExpress
                      ? `Bénéfriches considère que 75% de la surface polluée est dépolluée. Cette valeur est issue du retour d’expérience ADEME.`
                      : undefined
                  }
                />
              ) : null}
            </Section>
          ) : undefined}

          <Section title="🌾 Aménagement des espaces">
            {totalLivingAndActivitiesSpaces > 0 && (
              <>
                <DataLine
                  noBorder
                  label={<strong>Lieux d’habitation et d’activité</strong>}
                  value={
                    <strong>
                      {formatSurfaceArea(roundToInteger(totalLivingAndActivitiesSpaces))}
                    </strong>
                  }
                />
                {livingAndActivitiesSpaces
                  .filter(({ surfaceArea }) => surfaceArea)
                  .map(({ spaceCategory, soilType, surfaceArea }) => {
                    return (
                      <DataLine
                        label={getUrbanSpaceLabelForLivingAndActivitySpace(soilType)}
                        value={formatSurfaceArea(roundToInteger(surfaceArea))}
                        key={`${spaceCategory}-${soilType}`}
                        isDetails
                        valueTooltip={
                          isExpress
                            ? `On considère que ${(() => {
                                switch (soilType) {
                                  case "BUILDINGS":
                                    return "l'emprise au sol bâti";
                                  case "ARTIFICIAL_GRASS_OR_BUSHES_FILLED":
                                  case "ARTIFICIAL_TREE_FILLED":
                                    return "les jardins et allées enherbées privées";
                                  case "MINERAL_SOIL":
                                    return "les allées ou parkings privés en gravier ";
                                  case "IMPERMEABLE_SOILS":
                                    return "les allées ou parkings privés bitumés";
                                }
                              })()} occupent ${formatPercentage(computePercentage(surfaceArea, totalSurfaceArea))} de la surface du site des lieux d’habitation et d’activité ; fonction du type de projet « ${urbanProjectCategoryLabel} ». Cette valeur est issue du retour d’expérience ADEME.`
                            : undefined
                        }
                      />
                    );
                  })}
              </>
            )}
            {totalPublicGreenSpacesAndPublicGrassSpaces > 0 && (
              <>
                <DataLine
                  className="pt-2"
                  noBorder
                  label={<strong>Espaces verts publics</strong>}
                  value={
                    <strong>
                      {formatSurfaceArea(
                        roundToInteger(totalPublicGreenSpacesAndPublicGrassSpaces),
                      )}
                    </strong>
                  }
                />
                {totalGrassPublicSpaces > 0 && (
                  <DataLine
                    label="Voies, places, trottoirs enherbés"
                    value={formatSurfaceArea(roundToInteger(totalGrassPublicSpaces))}
                    isDetails
                    valueTooltip={
                      isExpress
                        ? `On considère que les jardins et allées enherbées publics occupent ${formatPercentage(computePercentage(totalGrassPublicSpaces, totalSurfaceArea))} de la surface du site des lieux d’habitation et d’activité ; fonction du type de projet « ${urbanProjectCategoryLabel} ». Cette valeur est issue du retour d’expérience ADEME.`
                        : undefined
                    }
                  />
                )}
                {totalPublicGreenSpaces > 0 && (
                  <DataLine
                    label="Espaces verts publics"
                    value={formatSurfaceArea(roundToInteger(totalPublicGreenSpaces))}
                    isDetails
                    valueTooltip={
                      isExpress
                        ? `On considère que les espaces verts publics occupent ${formatPercentage(computePercentage(totalPublicGreenSpaces, totalSurfaceArea))} de la surface du site des lieux d’habitation et d’activité ; fonction du type de projet « ${urbanProjectCategoryLabel} ». Cette valeur est issue du retour d’expérience ADEME.`
                        : undefined
                    }
                  />
                )}
              </>
            )}
            {totalOtherPublicSpaces > 0 && (
              <>
                <DataLine
                  className="pt-2"
                  noBorder
                  label={<strong>Espaces publics</strong>}
                  labelTooltip="Les espaces publics sont comptabilisés hors espaces verts."
                  value={
                    <strong>{formatSurfaceArea(roundToInteger(totalOtherPublicSpaces))}</strong>
                  }
                />
                {otherPublicSpaces
                  .filter(({ surfaceArea }) => surfaceArea)
                  .map(({ spaceCategory, soilType, surfaceArea }) => {
                    return (
                      <DataLine
                        label={getUrbanSpaceLabelForPublicSpace(soilType)}
                        value={formatSurfaceArea(roundToInteger(surfaceArea))}
                        key={`${spaceCategory}-${soilType}`}
                        isDetails
                        valueTooltip={
                          isExpress
                            ? `On considère que ${(() => {
                                switch (soilType) {
                                  case "MINERAL_SOIL":
                                    return "les voies, places, trottoirs en gravier";
                                  case "IMPERMEABLE_SOILS":
                                    return "les voies, places, trottoirs et parkings bitumés ";
                                }
                              })()} occupent ${formatPercentage(computePercentage(surfaceArea, totalSurfaceArea))} de la surface du site des lieux d’habitation et d’activité ; fonction du type de projet « ${urbanProjectCategoryLabel} ». Cette valeur est issue du retour d’expérience ADEME.`
                            : undefined
                        }
                      />
                    );
                  })}
              </>
            )}

            <div className="mt-4">
              <SoilsDistribution
                isExpressProject={isExpress}
                projectType="URBAN_PROJECT"
                soilsDistribution={soilsDistribution}
              />
            </div>
          </Section>

          {sumObjectValues(buildingsFloorAreaDistribution) > 0 && (
            <UrbanProjectBuildingsSection
              isExpress={isExpress}
              totalSurfaceArea={totalSurfaceArea}
              buildingsFloorAreaDistribution={buildingsFloorAreaDistribution}
              urbanProjectCategoryLabel={urbanProjectCategoryLabel}
            />
          )}
        </>
      );
    }
  }
};

export default DevelopmentPlanFeatures;

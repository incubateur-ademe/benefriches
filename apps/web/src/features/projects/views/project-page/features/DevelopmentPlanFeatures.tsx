import { ButtonProps } from "@codegouvfr/react-dsfr/Button";
import { sumObjectValues, typedObjectEntries } from "shared";

import { UrbanProjectCreationStep } from "@/features/create-project/core/urban-project/urbanProjectSteps";
import { ProjectFeatures } from "@/features/projects/domain/projects.types";
import {
  formatNumberFr,
  formatPercentage,
  formatSurfaceArea,
} from "@/shared/core/format-number/formatNumber";
import { computePercentage } from "@/shared/core/percentage/percentage";
import { getLabelForUrbanProjectSpace } from "@/shared/core/urbanProject";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";

import {
  getLabelForUrbanProjectCategory,
  getUrbanProjectCategoryFromFeatures,
} from "../../shared/urbanProjectCategory";
import SoilsDistribution from "./SoilsDistribution";
import UrbanProjectBuildingsSection from "./UrbanProjectBuildingsSection";

type Props = ProjectFeatures & {
  getSectionButtonProps?: (stepId: UrbanProjectCreationStep) => ButtonProps | undefined;
};

const DevelopmentPlanFeatures = ({
  developmentPlan,
  decontaminatedSoilSurface,
  soilsDistribution,
  isExpress,
  getSectionButtonProps,
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
              value={formatSurfaceArea(developmentPlan.surfaceArea)}
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
                value={formatSurfaceArea(decontaminatedSoilSurface)}
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
      const { spacesDistribution, buildingsFloorAreaDistribution } = developmentPlan;

      const livingAndActivitiesSpaces = {
        BUILDINGS_FOOTPRINT: spacesDistribution.BUILDINGS_FOOTPRINT ?? 0,
        PRIVATE_GARDEN_AND_GRASS_ALLEYS: spacesDistribution.PRIVATE_GARDEN_AND_GRASS_ALLEYS ?? 0,
        PRIVATE_PAVED_ALLEY_OR_PARKING_LOT:
          spacesDistribution.PRIVATE_PAVED_ALLEY_OR_PARKING_LOT ?? 0,
        PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT:
          spacesDistribution.PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT ?? 0,
      };
      const greenPublicSpaces = {
        PUBLIC_GREEN_SPACES: spacesDistribution.PUBLIC_GREEN_SPACES ?? 0,
        PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS:
          spacesDistribution.PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS ?? 0,
      };

      const publicSpaces = {
        PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS:
          spacesDistribution.PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS ?? 0,
        PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS:
          spacesDistribution.PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS ?? 0,
        PUBLIC_PARKING_LOT: spacesDistribution.PUBLIC_PARKING_LOT ?? 0,
      };

      const totalLivingAndActivitiesSpaces = sumObjectValues(livingAndActivitiesSpaces);
      const totalGreenPublicSpaces = sumObjectValues(greenPublicSpaces);
      const totalPublicSpaces = sumObjectValues(publicSpaces);

      const totalSurfaceArea = sumObjectValues(soilsDistribution);

      const urbanProjectCategory = getUrbanProjectCategoryFromFeatures({
        buildingsUseDistribution: buildingsFloorAreaDistribution,
        spacesDistribution,
      });

      const urbanProjectCategoryLabel = getLabelForUrbanProjectCategory(urbanProjectCategory);

      return (
        <>
          <Section
            title="🏘 Espaces"
            buttonProps={
              getSectionButtonProps
                ? getSectionButtonProps("URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION")
                : undefined
            }
          >
            <DataLine
              label={<strong>Superficie du site</strong>}
              value={
                <strong>
                  {formatSurfaceArea(sumObjectValues(developmentPlan.spacesDistribution))}
                </strong>
              }
            />
            {totalLivingAndActivitiesSpaces > 0 && (
              <DataLine
                label="Lieux d'habitation et d’activité"
                labelTooltip="Les lieux d'habitation et d’activité regroupent les lots dédiés aux logements, aux activités économiques, les emprises des équipements publics, en dehors des espaces verts publics et autres espaces publics de type rues, places, parking…"
                value={formatSurfaceArea(totalLivingAndActivitiesSpaces)}
                valueTooltip={
                  isExpress
                    ? `On considère que les lieux d'habitation et d’activité occupent ${formatPercentage(computePercentage(totalLivingAndActivitiesSpaces, totalSurfaceArea))} de la surface du site ; fonction du type de projet « ${urbanProjectCategoryLabel} ». Cette valeur est issue du retour d’expérience ADEME.`
                    : undefined
                }
              />
            )}
            {totalPublicSpaces > 0 && (
              <DataLine
                label="Espaces publics"
                value={formatSurfaceArea(totalPublicSpaces)}
                valueTooltip={
                  isExpress
                    ? `On considère que les espaces publics occupent ${formatPercentage(computePercentage(totalPublicSpaces, totalSurfaceArea))} de la surface du site ; fonction du type de projet « ${urbanProjectCategoryLabel} ». Cette valeur est issue du retour d’expérience ADEME.`
                    : undefined
                }
              />
            )}
            {totalGreenPublicSpaces > 0 && (
              <DataLine
                label="Espaces verts publics"
                labelTooltip="Il s’agit des espaces verts publics (parcs, jardins, forêt urbaines, alignements d’arbres, noues, etc.)."
                valueTooltip={
                  isExpress
                    ? `On considère que les espaces verts occupent ${formatPercentage(computePercentage(totalGreenPublicSpaces, totalSurfaceArea))} de la surface du site ; fonction du type de projet « ${urbanProjectCategoryLabel} ». Cette valeur est issue du retour d’expérience ADEME.`
                    : undefined
                }
                value={formatSurfaceArea(totalGreenPublicSpaces)}
              />
            )}
          </Section>
          {decontaminatedSoilSurface ? (
            <Section
              buttonProps={
                getSectionButtonProps
                  ? getSectionButtonProps("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION")
                  : undefined
              }
              title="✨ Dépollution"
              tooltip="Les sols de la friche nécessitent une dépollution pour permettre la réalisation du projet. La pollution à l’amiante des bâtiments n’est pas considérée ici."
            >
              {decontaminatedSoilSurface ? (
                <DataLine
                  label="Surface dépolluée"
                  value={formatSurfaceArea(decontaminatedSoilSurface)}
                  valueTooltip={
                    isExpress
                      ? `Bénéfriches considère que 75% de la surface polluée est dépolluée. Cette valeur est issue du retour d’expérience ADEME.`
                      : undefined
                  }
                />
              ) : null}
            </Section>
          ) : undefined}

          <Section
            title="🌾 Aménagement des espaces"
            buttonProps={
              getSectionButtonProps
                ? getSectionButtonProps("URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION")
                : undefined
            }
          >
            {totalLivingAndActivitiesSpaces > 0 && (
              <>
                <DataLine
                  noBorder
                  label={<strong>Lieux d’habitation et d’activité</strong>}
                  value={<strong>{formatSurfaceArea(totalLivingAndActivitiesSpaces)}</strong>}
                />
                {typedObjectEntries(livingAndActivitiesSpaces)
                  .filter(([, surfaceArea]) => surfaceArea)
                  .map(([space, surfaceArea]) => {
                    return (
                      <DataLine
                        label={getLabelForUrbanProjectSpace(space)}
                        value={formatSurfaceArea(surfaceArea)}
                        key={space}
                        isDetails
                        valueTooltip={
                          isExpress
                            ? `On considère que ${(() => {
                                switch (space) {
                                  case "BUILDINGS_FOOTPRINT":
                                    return "l'emprise au sol bâti";
                                  case "PRIVATE_GARDEN_AND_GRASS_ALLEYS":
                                    return "les jardins et allées enherbées privées";
                                  case "PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT":
                                    return "les allées ou parkings privés en gravier ";
                                  case "PRIVATE_PAVED_ALLEY_OR_PARKING_LOT":
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
            {totalGreenPublicSpaces > 0 && (
              <>
                <DataLine
                  className="pt-2"
                  noBorder
                  label={<strong>Espaces verts publics</strong>}
                  value={<strong>{formatSurfaceArea(totalGreenPublicSpaces)}</strong>}
                />
                {typedObjectEntries(greenPublicSpaces)
                  .filter(([, surfaceArea]) => surfaceArea)
                  .map(([space, surfaceArea]) => {
                    return (
                      <DataLine
                        label={getLabelForUrbanProjectSpace(space)}
                        value={formatSurfaceArea(surfaceArea)}
                        key={space}
                        isDetails
                        valueTooltip={
                          isExpress
                            ? `On considère que ${(() => {
                                switch (space) {
                                  case "PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS":
                                    return "les espaces verts publics";
                                  case "PUBLIC_GREEN_SPACES":
                                    return "les jardins et allées enherbées publics";
                                }
                              })()} occupent ${formatPercentage(computePercentage(surfaceArea, totalSurfaceArea))} de la surface du site des lieux d’habitation et d’activité ; fonction du type de projet « ${urbanProjectCategoryLabel} ». Cette valeur est issue du retour d’expérience ADEME.`
                            : undefined
                        }
                      />
                    );
                  })}
              </>
            )}
            {totalPublicSpaces > 0 && (
              <>
                <DataLine
                  className="pt-2"
                  noBorder
                  label={<strong>Espaces publics</strong>}
                  labelTooltip="Les espaces publics sont comptabilisés hors espaces verts."
                  value={<strong>{formatSurfaceArea(totalPublicSpaces)}</strong>}
                />
                {typedObjectEntries(publicSpaces)
                  .filter(([, surfaceArea]) => surfaceArea)
                  .map(([space, surfaceArea]) => {
                    return (
                      <DataLine
                        label={getLabelForUrbanProjectSpace(space)}
                        value={formatSurfaceArea(surfaceArea)}
                        key={space}
                        isDetails
                        valueTooltip={
                          isExpress
                            ? `On considère que ${(() => {
                                switch (space) {
                                  case "PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS":
                                    return "les voies, places, trottoirs en gravier";
                                  case "PUBLIC_PARKING_LOT":
                                    return "les parkings";
                                  case "PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS":
                                    return "les voies, places, trottoirs bitumés ";
                                }
                              })()} occupent ${formatPercentage(computePercentage(surfaceArea, totalSurfaceArea))} de la surface du site des lieux d’habitation et d’activité ; fonction du type de projet « ${urbanProjectCategoryLabel} ». Cette valeur est issue du retour d’expérience ADEME.`
                            : undefined
                        }
                      />
                    );
                  })}
              </>
            )}

            <h4 className="text-base pb-2 pt-4 mb-0">Répartition des sols</h4>

            <SoilsDistribution
              isExpressProject={isExpress}
              projectType="URBAN_PROJECT"
              soilsDistribution={soilsDistribution}
            />
          </Section>

          {livingAndActivitiesSpaces.BUILDINGS_FOOTPRINT > 0 && (
            <UrbanProjectBuildingsSection
              buttonProps={
                getSectionButtonProps
                  ? getSectionButtonProps("URBAN_PROJECT_BUILDINGS_INTRODUCTION")
                  : undefined
              }
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

import { sumObjectValues, typedObjectEntries } from "shared";

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

type Props = ProjectFeatures;

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
      const livingAndActivitiesSpaces = {
        BUILDINGS_FOOTPRINT: developmentPlan.spaces.BUILDINGS_FOOTPRINT ?? 0,
        PRIVATE_GARDEN_AND_GRASS_ALLEYS:
          developmentPlan.spaces.PRIVATE_GARDEN_AND_GRASS_ALLEYS ?? 0,
        PRIVATE_PAVED_ALLEY_OR_PARKING_LOT:
          developmentPlan.spaces.PRIVATE_PAVED_ALLEY_OR_PARKING_LOT ?? 0,
        PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT:
          developmentPlan.spaces.PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT ?? 0,
      };
      const greenPublicSpaces = {
        PUBLIC_GREEN_SPACES: developmentPlan.spaces.PUBLIC_GREEN_SPACES ?? 0,
        PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS:
          developmentPlan.spaces.PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS ?? 0,
      };

      const publicSpaces = {
        PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS:
          developmentPlan.spaces.PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS ?? 0,
        PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS:
          developmentPlan.spaces.PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS ?? 0,
        PUBLIC_PARKING_LOT: developmentPlan.spaces.PUBLIC_PARKING_LOT ?? 0,
      };

      const totalLivingAndActivitiesSpaces = sumObjectValues(livingAndActivitiesSpaces);
      const totalGreenPublicSpaces = sumObjectValues(greenPublicSpaces);
      const totalPublicSpaces = sumObjectValues(publicSpaces);

      const totalSurfaceArea = sumObjectValues(soilsDistribution);

      const urbanProjectCategory = getUrbanProjectCategoryFromFeatures({
        buildingsUseDistribution: developmentPlan.buildingsFloorArea,
        spacesDistribution: developmentPlan.spaces,
      });

      const urbanProjectCategoryLabel = getLabelForUrbanProjectCategory(urbanProjectCategory);

      return (
        <>
          <Section title="🏘 Espaces">
            <DataLine
              label={<strong>Superficie du site</strong>}
              value={<strong>{formatSurfaceArea(sumObjectValues(developmentPlan.spaces))}</strong>}
            />
            {totalLivingAndActivitiesSpaces > 0 && (
              <DataLine
                label="Lieux de vie et d’activités"
                labelTooltip="Les lieux de vie et d’activité regroupent les lots dédiés aux logements, aux activités économiques, les emprises des équipements publics, en dehors des espaces verts publics et autres espaces publics de type rues, places, parking…"
                value={formatSurfaceArea(totalLivingAndActivitiesSpaces)}
                valueTooltip={
                  isExpress
                    ? `On considère que les lieux de vie et d’activité occupent ${formatPercentage(computePercentage(totalLivingAndActivitiesSpaces, totalSurfaceArea))} de la surface du site ; fonction du type de projet « ${urbanProjectCategoryLabel} ». Cette valeur est issue du retour d’expérience ADEME.`
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

          <Section title="🌾 Aménagement des espaces">
            {totalLivingAndActivitiesSpaces > 0 && (
              <>
                <DataLine
                  noBorder
                  label={<strong>Lieux de vie et d’activités</strong>}
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
                              })()} occupent ${formatPercentage(computePercentage(surfaceArea, totalSurfaceArea))} de la surface du site des lieux de vie et d’activité ; fonction du type de projet « ${urbanProjectCategoryLabel} ». Cette valeur est issue du retour d’expérience ADEME.`
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
                  className="tw-pt-2"
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
                                    return "les jardins et allées enherbées privées";
                                }
                              })()} occupent ${formatPercentage(computePercentage(surfaceArea, totalSurfaceArea))} de la surface du site des lieux de vie et d’activité ; fonction du type de projet « ${urbanProjectCategoryLabel} ». Cette valeur est issue du retour d’expérience ADEME.`
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
                  className="tw-pt-2"
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
                              })()} occupent ${formatPercentage(computePercentage(surfaceArea, totalSurfaceArea))} de la surface du site des lieux de vie et d’activité ; fonction du type de projet « ${urbanProjectCategoryLabel} ». Cette valeur est issue du retour d’expérience ADEME.`
                            : undefined
                        }
                      />
                    );
                  })}
              </>
            )}

            <h4 className="tw-text-base tw-pb-2 tw-pt-4 tw-mb-0">Répartition des sols</h4>

            <SoilsDistribution
              isExpressProject={isExpress}
              projectType="URBAN_PROJECT"
              soilsDistribution={soilsDistribution}
            />
          </Section>

          <UrbanProjectBuildingsSection
            isExpress={isExpress}
            totalSurfaceArea={totalSurfaceArea}
            buildingsFloorArea={developmentPlan.buildingsFloorArea}
            urbanProjectCategoryLabel={urbanProjectCategoryLabel}
          />
        </>
      );
    }
  }
};

export default DevelopmentPlanFeatures;

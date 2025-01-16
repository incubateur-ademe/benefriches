import { sumObjectValues, typedObjectEntries } from "shared";

import { ProjectFeatures } from "@/features/projects/domain/projects.types";
import { formatNumberFr, formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import { getLabelForUrbanProjectSpace } from "@/shared/core/urbanProject";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";

import SoilsDistribution from "./SoilsDistribution";
import UrbanProjectBuildingsSection from "./UrbanProjectBuildingsSection";

type Props = ProjectFeatures;

const DevelopmentPlanFeatures = ({
  developmentPlan,
  decontaminatedSoilSurface,
  soilsDistribution,
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
            <SoilsDistribution soilsDistribution={soilsDistribution} />
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
                value={formatSurfaceArea(totalLivingAndActivitiesSpaces)}
              />
            )}
            {totalGreenPublicSpaces > 0 && (
              <DataLine label="Espaces verts" value={formatSurfaceArea(totalGreenPublicSpaces)} />
            )}
            {totalPublicSpaces > 0 && (
              <DataLine label="Espaces publics" value={formatSurfaceArea(totalPublicSpaces)} />
            )}
          </Section>
          {decontaminatedSoilSurface ? (
            <Section title="✨ Dépollution">
              {decontaminatedSoilSurface ? (
                <DataLine
                  label="Surface dépolluée"
                  value={formatSurfaceArea(decontaminatedSoilSurface)}
                />
              ) : null}
            </Section>
          ) : undefined}

          <Section title="🏘 Aménagement des espaces">
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
                  label={<strong>Espaces verts</strong>}
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
                      />
                    );
                  })}
              </>
            )}

            <h4 className="tw-text-base tw-pb-2 tw-pt-4 tw-mb-0">Répartition des sols</h4>

            <SoilsDistribution soilsDistribution={soilsDistribution} />
          </Section>

          <UrbanProjectBuildingsSection buildingsFloorArea={developmentPlan.buildingsFloorArea} />
        </>
      );
    }
  }
};

export default DevelopmentPlanFeatures;

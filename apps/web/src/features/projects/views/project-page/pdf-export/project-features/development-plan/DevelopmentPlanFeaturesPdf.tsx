import { Text } from "@react-pdf/renderer";
import { sumObjectValues, typedObjectEntries } from "shared";

import { ProjectFeatures } from "@/features/projects/domain/projects.types";
import { getLabelForBuildingsUse, getLabelForUrbanProjectSpace } from "@/shared/core/urbanProject";

import DataLine from "../../components/DataLine";
import FeaturesSection from "../../components/FeaturesSection";
import { formatNumberPdf, formatSurfaceAreaPdf } from "../../format";
import { tw } from "../../styles";
import SoilsDistributionPdf from "./SoilsDistributionPdf";

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
          <FeaturesSection title="⚙️ Paramètres du projet">
            <DataLine
              label="Puissance d'installation"
              bold
              value={`${formatNumberPdf(developmentPlan.electricalPowerKWc)} kWc`}
            />
            <DataLine
              label="Superficie occupée par les panneaux"
              bold
              value={formatSurfaceAreaPdf(developmentPlan.surfaceArea)}
            />
            <DataLine
              label="Production annuelle attendue"
              bold
              value={`${formatNumberPdf(developmentPlan.expectedAnnualProduction)} MWh / an`}
            />
            <DataLine
              label="Durée du contrat de revente d'énergie"
              bold
              value={`${formatNumberPdf(developmentPlan.contractDuration)} ans`}
            />
          </FeaturesSection>
          <FeaturesSection title="🌾 Transformation des sols">
            {decontaminatedSoilSurface ? (
              <DataLine
                label="Surface dépolluée"
                value={formatSurfaceAreaPdf(decontaminatedSoilSurface)}
              />
            ) : null}
          </FeaturesSection>
          <SoilsDistributionPdf soilsDistribution={soilsDistribution} />
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

      return (
        <>
          <FeaturesSection title="🏘 Espaces">
            <DataLine
              label="Superficie du site"
              bold
              value={formatSurfaceAreaPdf(
                totalLivingAndActivitiesSpaces + totalPublicSpaces + totalGreenPublicSpaces,
              )}
            />
            {totalLivingAndActivitiesSpaces > 0 && (
              <DataLine
                label="Lieux d'habitation et d'activités"
                value={formatSurfaceAreaPdf(totalLivingAndActivitiesSpaces)}
              />
            )}
            {totalPublicSpaces > 0 && (
              <DataLine label="Espaces publics" value={formatSurfaceAreaPdf(totalPublicSpaces)} />
            )}
            {totalGreenPublicSpaces > 0 && (
              <DataLine
                label="Espaces verts publics"
                value={formatSurfaceAreaPdf(totalGreenPublicSpaces)}
              />
            )}
          </FeaturesSection>
          {decontaminatedSoilSurface ? (
            <FeaturesSection title="✨ Dépollution">
              {decontaminatedSoilSurface ? (
                <DataLine
                  label="Surface dépolluée"
                  value={formatSurfaceAreaPdf(decontaminatedSoilSurface)}
                />
              ) : null}
            </FeaturesSection>
          ) : undefined}

          <FeaturesSection title="🌾 Aménagement des espaces">
            {totalLivingAndActivitiesSpaces > 0 && (
              <>
                <DataLine
                  label="Lieux d'habitation et d'activités"
                  value={formatSurfaceAreaPdf(totalLivingAndActivitiesSpaces)}
                  bold
                  noBorder
                />
                {typedObjectEntries(livingAndActivitiesSpaces)
                  .filter(([, surfaceArea]) => surfaceArea)
                  .map(([space, surfaceArea]) => {
                    return (
                      <DataLine
                        label={getLabelForUrbanProjectSpace(space)}
                        value={formatSurfaceAreaPdf(surfaceArea)}
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
                  label="Espaces verts publics"
                  value={formatSurfaceAreaPdf(totalGreenPublicSpaces)}
                  noBorder
                  bold
                />
                {typedObjectEntries(greenPublicSpaces)
                  .filter(([, surfaceArea]) => surfaceArea)
                  .map(([space, surfaceArea]) => {
                    return (
                      <DataLine
                        label={getLabelForUrbanProjectSpace(space)}
                        value={formatSurfaceAreaPdf(surfaceArea)}
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
                  label="Espaces publics"
                  value={formatSurfaceAreaPdf(totalPublicSpaces)}
                  noBorder
                  bold
                />
                {typedObjectEntries(publicSpaces)
                  .filter(([, surfaceArea]) => surfaceArea)
                  .map(([space, surfaceArea]) => {
                    return (
                      <DataLine
                        label={getLabelForUrbanProjectSpace(space)}
                        value={formatSurfaceAreaPdf(surfaceArea)}
                        key={space}
                        isDetails
                      />
                    );
                  })}
              </>
            )}
          </FeaturesSection>
          <SoilsDistributionPdf soilsDistribution={soilsDistribution} />

          <FeaturesSection title="🏢 Bâtiments">
            <DataLine
              label="Surface de plancher des bâtiments"
              labelClassName="font-bold"
              value={formatSurfaceAreaPdf(sumObjectValues(buildingsFloorAreaDistribution))}
              noBorder
            />
            <Text style={tw("pb-2 pt-4 mb-0 font-bold text-sm")}>Usage des bâtiments</Text>
            {typedObjectEntries(buildingsFloorAreaDistribution).map(([use, value]) =>
              value ? (
                <DataLine
                  key={use}
                  label={getLabelForBuildingsUse(use)}
                  value={formatSurfaceAreaPdf(value)}
                  isDetails
                />
              ) : undefined,
            )}
          </FeaturesSection>
        </>
      );
    }
  }
};

export default DevelopmentPlanFeatures;

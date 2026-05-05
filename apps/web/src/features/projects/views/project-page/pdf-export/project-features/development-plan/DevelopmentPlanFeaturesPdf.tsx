import { Text } from "@react-pdf/renderer";
import { sumListWithKey, sumObjectValues, typedObjectEntries } from "shared";

import { ProjectFeatures } from "@/features/projects/domain/projects.types";
import {
  getLabelForBuildingsUse,
  getUrbanSpaceLabelForLivingAndActivitySpace,
  getUrbanSpaceLabelForPublicSpace,
} from "@/shared/core/urbanProject";

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
      const {
        buildingsFloorAreaDistribution,
        buildingsFootprintToReuse,
        existingBuildingsUsesFloorSurfaceArea,
        newBuildingsUsesFloorSurfaceArea,
        developerWillBeBuildingsConstructor,
      } = developmentPlan;

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
      const projectBuildingsFootprint =
        soilsDistribution.find(({ soilType }) => soilType === "BUILDINGS")?.surfaceArea ?? 0;
      const totalPublicGreenSpacesAndPublicGrassSpaces =
        totalGrassPublicSpaces + totalPublicGreenSpaces;
      const totalOtherPublicSpaces = sumListWithKey(otherPublicSpaces, "surfaceArea");

      return (
        <>
          <FeaturesSection title="🏘️️ Espaces">
            <DataLine
              label="Superficie du site"
              bold
              value={formatSurfaceAreaPdf(
                totalLivingAndActivitiesSpaces +
                  totalOtherPublicSpaces +
                  totalPublicGreenSpacesAndPublicGrassSpaces,
              )}
            />
            {totalLivingAndActivitiesSpaces > 0 && (
              <DataLine
                label="Lieux d'habitation et d'activités"
                value={formatSurfaceAreaPdf(totalLivingAndActivitiesSpaces)}
              />
            )}
            {totalOtherPublicSpaces > 0 && (
              <DataLine
                label="Espaces publics"
                value={formatSurfaceAreaPdf(totalOtherPublicSpaces)}
              />
            )}
            {totalPublicGreenSpacesAndPublicGrassSpaces > 0 && (
              <DataLine
                label="Espaces verts publics"
                value={formatSurfaceAreaPdf(totalPublicGreenSpacesAndPublicGrassSpaces)}
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
                {livingAndActivitiesSpaces
                  .filter(({ surfaceArea }) => surfaceArea)
                  .map(({ spaceCategory, soilType, surfaceArea }) => {
                    return (
                      <DataLine
                        label={getUrbanSpaceLabelForLivingAndActivitySpace(soilType)}
                        value={formatSurfaceAreaPdf(surfaceArea)}
                        key={`${spaceCategory}-${soilType}`}
                        isDetails
                      />
                    );
                  })}
              </>
            )}
            {totalPublicGreenSpacesAndPublicGrassSpaces > 0 && (
              <>
                <DataLine
                  label="Espaces verts publics"
                  value={formatSurfaceAreaPdf(totalPublicGreenSpacesAndPublicGrassSpaces)}
                  noBorder
                  bold
                />
                {totalGrassPublicSpaces > 0 && (
                  <DataLine
                    label="Voies, places, trottoirs enherbés"
                    value={formatSurfaceAreaPdf(totalGrassPublicSpaces)}
                    isDetails
                  />
                )}
                {totalPublicGreenSpaces > 0 && (
                  <DataLine
                    label="Espaces verts publics"
                    value={formatSurfaceAreaPdf(totalPublicGreenSpaces)}
                    isDetails
                  />
                )}
              </>
            )}
            {totalOtherPublicSpaces > 0 && (
              <>
                <DataLine
                  label="Espaces publics"
                  value={formatSurfaceAreaPdf(totalOtherPublicSpaces)}
                  noBorder
                  bold
                />
                {otherPublicSpaces
                  .filter(({ surfaceArea }) => surfaceArea)
                  .map(({ spaceCategory, soilType, surfaceArea }) => {
                    return (
                      <DataLine
                        label={getUrbanSpaceLabelForPublicSpace(soilType)}
                        value={formatSurfaceAreaPdf(surfaceArea)}
                        key={`${spaceCategory}-${soilType}`}
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
            {buildingsFootprintToReuse !== undefined && (
              <DataLine
                label="Emprise au sol des bâtiments à réemployer"
                value={formatSurfaceAreaPdf(buildingsFootprintToReuse)}
                noBorder
                bold
              />
            )}
            {buildingsFootprintToReuse !== undefined && (
              <DataLine
                label="Emprise au sol des nouveaux bâtiments"
                value={formatSurfaceAreaPdf(
                  Math.max(0, projectBuildingsFootprint - buildingsFootprintToReuse),
                )}
                noBorder
                bold
              />
            )}
            {existingBuildingsUsesFloorSurfaceArea && (
              <>
                <DataLine
                  label="Bâtiments existants"
                  value={formatSurfaceAreaPdf(
                    sumObjectValues(existingBuildingsUsesFloorSurfaceArea),
                  )}
                  noBorder
                  bold
                />
                {typedObjectEntries(existingBuildingsUsesFloorSurfaceArea).map(([use, value]) =>
                  value ? (
                    <DataLine
                      key={use}
                      label={getLabelForBuildingsUse(use)}
                      value={formatSurfaceAreaPdf(value)}
                      isDetails
                    />
                  ) : undefined,
                )}
              </>
            )}
            {newBuildingsUsesFloorSurfaceArea && (
              <>
                <DataLine
                  label="Bâtiments neufs"
                  value={formatSurfaceAreaPdf(sumObjectValues(newBuildingsUsesFloorSurfaceArea))}
                  noBorder
                  bold
                />
                {typedObjectEntries(newBuildingsUsesFloorSurfaceArea).map(([use, value]) =>
                  value ? (
                    <DataLine
                      key={use}
                      label={getLabelForBuildingsUse(use)}
                      value={formatSurfaceAreaPdf(value)}
                      isDetails
                    />
                  ) : undefined,
                )}
              </>
            )}
            {developerWillBeBuildingsConstructor !== undefined && (
              <DataLine
                label="L'aménageur sera constructeur des nouveaux bâtiments"
                value={developerWillBeBuildingsConstructor ? "Oui" : "Non"}
                noBorder
              />
            )}
          </FeaturesSection>
        </>
      );
    }
  }
};

export default DevelopmentPlanFeatures;

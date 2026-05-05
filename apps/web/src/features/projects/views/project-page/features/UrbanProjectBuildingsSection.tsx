import { sumObjectValues, typedObjectEntries } from "shared";

import { UrbanProjectFeatures } from "@/features/projects/domain/projects.types";
import { formatPercentage, formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import { computePercentage } from "@/shared/core/percentage/percentage";
import { getLabelForBuildingsUse } from "@/shared/core/urbanProject";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";
import InfoTooltip from "@/shared/views/components/InfoTooltip/InfoTooltip";

type Props = {
  buildingsFloorAreaDistribution: UrbanProjectFeatures["buildingsFloorAreaDistribution"];
  buildingsFootprintToReuse?: UrbanProjectFeatures["buildingsFootprintToReuse"];
  existingBuildingsUsesFloorSurfaceArea?: UrbanProjectFeatures["existingBuildingsUsesFloorSurfaceArea"];
  newBuildingsUsesFloorSurfaceArea?: UrbanProjectFeatures["newBuildingsUsesFloorSurfaceArea"];
  developerWillBeBuildingsConstructor?: UrbanProjectFeatures["developerWillBeBuildingsConstructor"];
  isExpress: boolean;
  projectBuildingsFootprint: number;
  totalSurfaceArea: number;
  urbanProjectCategoryLabel: string;
};

const UrbanProjectBuildingsSection = ({
  buildingsFloorAreaDistribution,
  buildingsFootprintToReuse,
  existingBuildingsUsesFloorSurfaceArea,
  newBuildingsUsesFloorSurfaceArea,
  developerWillBeBuildingsConstructor,
  isExpress,
  projectBuildingsFootprint,
  totalSurfaceArea,
  urbanProjectCategoryLabel,
}: Props) => {
  const totalBuildingsSurfaceArea = sumObjectValues(buildingsFloorAreaDistribution);
  const totalExistingBuildingsUsesSurfaceArea = sumObjectValues(
    existingBuildingsUsesFloorSurfaceArea ?? {},
  );
  const totalNewBuildingsUsesSurfaceArea = sumObjectValues(newBuildingsUsesFloorSurfaceArea ?? {});
  const hasReuseData =
    buildingsFootprintToReuse !== undefined ||
    existingBuildingsUsesFloorSurfaceArea !== undefined ||
    newBuildingsUsesFloorSurfaceArea !== undefined ||
    developerWillBeBuildingsConstructor !== undefined;
  const newBuildingsFootprint =
    buildingsFootprintToReuse !== undefined
      ? Math.max(0, projectBuildingsFootprint - buildingsFootprintToReuse)
      : undefined;
  const hasBuildingsFloorAreaData = totalBuildingsSurfaceArea > 0;
  return (
    <Section
      title="🏢 Bâtiments"
      tooltip={
        isExpress
          ? "Répartition représentative de l’aménagement des espaces pour ce type de projet urbain. L’occupation des sols conditionne la capacité d’infiltration des eaux, la capacité de stockage de carbone dans les sols, etc."
          : undefined
      }
    >
      {hasBuildingsFloorAreaData && (
        <>
          <DataLine
            noBorder
            label={<strong>Surface de plancher des bâtiments</strong>}
            value={formatSurfaceArea(totalBuildingsSurfaceArea)}
            valueTooltip={
              isExpress
                ? `On considère que la surface de plancher des bâtiments est de ${formatPercentage(computePercentage(totalBuildingsSurfaceArea, totalSurfaceArea))} de la surface du site des lieux d’habitation et d’activité ; fonction du type de projet « ${urbanProjectCategoryLabel} ». Cette valeur est issue du retour d’expérience ADEME.`
                : undefined
            }
          />
          <h4 className="text-base pb-2 pt-4 mb-0">
            Usage des bâtiments{" "}
            <InfoTooltip title="L’usage des bâtiments correspond à leur destination (logements, services de proximité, bureaux, équipements publics, etc.)" />
          </h4>
          {typedObjectEntries(buildingsFloorAreaDistribution).map(([use, value]) =>
            value ? (
              <DataLine
                key={use}
                label={getLabelForBuildingsUse(use)}
                value={formatSurfaceArea(value)}
                isDetails
                valueTooltip={
                  isExpress
                    ? `On considère que ${(() => {
                        switch (use) {
                          case "RESIDENTIAL":
                            return "les logements ";
                          case "LOCAL_STORE":
                            return "les commerces de proximité";
                          case "OFFICES":
                            return "les bureaux";
                          case "LOCAL_SERVICES":
                            return "les services de proximité";
                          case "ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES":
                            return "les locaux industriels, artisanaux ou logistiques";
                          case "PUBLIC_FACILITIES":
                            return "les équipements publics";
                          case "OTHER_CULTURAL_PLACE":
                            return "les lieux culturels";
                          case "SPORTS_FACILITIES":
                            return "les équipements sportifs";
                          case "MULTI_STORY_PARKING":
                            return "les parkings silo";
                          case "OTHER_BUILDING":
                            return "les autres types de bâtiments";
                        }
                      })()} occupent ${computePercentage(value, totalSurfaceArea)}} de la surface du site des lieux d’habitation et d’activité ; fonction du type de projet « ${urbanProjectCategoryLabel} ». Cette valeur est issue du retour d’expérience ADEME.`
                    : undefined
                }
              />
            ) : undefined,
          )}
        </>
      )}
      {hasReuseData && (
        <>
          <h4 className="text-base pb-2 pt-4 mb-0">Réemploi et construction</h4>
          {buildingsFootprintToReuse !== undefined && (
            <DataLine
              label={<strong>Emprise au sol des bâtiments à réemployer</strong>}
              value={formatSurfaceArea(buildingsFootprintToReuse)}
            />
          )}
          {newBuildingsFootprint !== undefined && (
            <DataLine
              label={<strong>Emprise au sol des nouveaux bâtiments</strong>}
              value={formatSurfaceArea(newBuildingsFootprint)}
            />
          )}
          {existingBuildingsUsesFloorSurfaceArea && (
            <>
              <DataLine
                noBorder
                label={<strong>Bâtiments existants</strong>}
                value={<strong>{formatSurfaceArea(totalExistingBuildingsUsesSurfaceArea)}</strong>}
              />
              {typedObjectEntries(existingBuildingsUsesFloorSurfaceArea).map(([use, value]) =>
                value ? (
                  <DataLine
                    key={String(use)}
                    label={getLabelForBuildingsUse(use)}
                    value={formatSurfaceArea(value)}
                    isDetails
                  />
                ) : undefined,
              )}
            </>
          )}
          {newBuildingsUsesFloorSurfaceArea && (
            <>
              <DataLine
                noBorder
                label={<strong>Bâtiments neufs</strong>}
                value={<strong>{formatSurfaceArea(totalNewBuildingsUsesSurfaceArea)}</strong>}
              />
              {typedObjectEntries(newBuildingsUsesFloorSurfaceArea).map(([use, value]) =>
                value ? (
                  <DataLine
                    key={String(use)}
                    label={getLabelForBuildingsUse(use)}
                    value={formatSurfaceArea(value)}
                    isDetails
                  />
                ) : undefined,
              )}
            </>
          )}
          {developerWillBeBuildingsConstructor !== undefined && (
            <DataLine
              label={<strong>L'aménageur sera constructeur des nouveaux bâtiments</strong>}
              value={developerWillBeBuildingsConstructor ? "Oui" : "Non"}
            />
          )}
        </>
      )}
    </Section>
  );
};

export default UrbanProjectBuildingsSection;

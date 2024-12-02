import {
  ECONOMIC_ACTIVITY_BUILDINGS_USE,
  filterObjectWithKeys,
  filterObjectWithoutKeys,
  sumObjectValues,
  typedObjectEntries,
} from "shared";

import { UrbanProjectFeatures } from "@/features/projects/domain/projects.types";
import { getLabelForBuildingFloorArea } from "@/shared/domain/urbanProject";
import { formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";

type Props = { buildingsFloorArea: UrbanProjectFeatures["buildingsFloorArea"] };

const UrbanProjectBuildingsSection = ({ buildingsFloorArea }: Props) => {
  const economicActivityBuildings = filterObjectWithKeys(
    buildingsFloorArea,
    ECONOMIC_ACTIVITY_BUILDINGS_USE,
  );
  const economicActivitySurfaceArea = sumObjectValues(economicActivityBuildings);
  const otherBuildings = filterObjectWithoutKeys(buildingsFloorArea, [
    ...ECONOMIC_ACTIVITY_BUILDINGS_USE,
    "RESIDENTIAL",
    "OTHER",
  ]);

  return (
    <Section title="🏘 Bâtiments">
      <DataLine
        noBorder
        label={<strong>Surface de plancher des bâtiments</strong>}
        value={formatSurfaceArea(sumObjectValues(buildingsFloorArea))}
      />
      <h4 className="tw-text-base tw-pb-2 tw-pt-4 tw-mb-0">Usage de bâtiments</h4>
      {buildingsFloorArea.RESIDENTIAL ? (
        <DataLine
          label={getLabelForBuildingFloorArea("RESIDENTIAL")}
          value={formatSurfaceArea(buildingsFloorArea.RESIDENTIAL)}
          isDetails
        />
      ) : undefined}

      {economicActivitySurfaceArea > 0 ? (
        <DataLine
          label="Lieux d’activité économique"
          value={formatSurfaceArea(economicActivitySurfaceArea)}
          isDetails
        />
      ) : undefined}
      {typedObjectEntries(otherBuildings).map(([category, value]) =>
        value ? (
          <DataLine
            key={category}
            label={getLabelForBuildingFloorArea(category)}
            value={formatSurfaceArea(value)}
            isDetails
          />
        ) : undefined,
      )}
      {buildingsFloorArea.OTHER ? (
        <DataLine
          label={getLabelForBuildingFloorArea("OTHER")}
          value={formatSurfaceArea(buildingsFloorArea.OTHER)}
          isDetails
        />
      ) : undefined}

      {economicActivitySurfaceArea > 0 && (
        <>
          <h4 className="tw-text-base tw-pb-2 tw-pt-4 tw-mb-0">Lieux d’activité économique</h4>
          <DataLine
            noBorder
            label="Espaces à aménager"
            value={<strong>{formatSurfaceArea(economicActivitySurfaceArea)}</strong>}
          />
          {typedObjectEntries(economicActivityBuildings).map(([category, value]) =>
            value ? (
              <DataLine
                key={category}
                label={` ➔ ${getLabelForBuildingFloorArea(category)}`}
                value={formatSurfaceArea(value)}
                isDetails
              />
            ) : undefined,
          )}
        </>
      )}
    </Section>
  );
};

export default UrbanProjectBuildingsSection;

import { sumObjectValues } from "shared";

import { UrbanProjectFeatures } from "@/features/projects/domain/projects.types";
import { getLabelForBuildingFloorArea } from "@/shared/domain/urbanProject";
import { formatSurfaceArea } from "@/shared/services/format-number/formatNumber";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";

type Props = { buildingsFloorArea: UrbanProjectFeatures["buildingsFloorArea"] };

const UrbanProjectBuildingsSection = ({ buildingsFloorArea }: Props) => {
  const placesOfEconomicActivitySurfaceArea =
    (buildingsFloorArea.GROUND_FLOOR_RETAIL ?? 0) +
    (buildingsFloorArea.OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS ?? 0) +
    (buildingsFloorArea.SHIPPING_OR_INDUSTRIAL_BUILDINGS ?? 0) +
    (buildingsFloorArea.TERTIARY_ACTIVITIES ?? 0);
  return (
    <>
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

        {placesOfEconomicActivitySurfaceArea > 0 ? (
          <DataLine
            label="Lieux d’activité économique"
            value={formatSurfaceArea(placesOfEconomicActivitySurfaceArea)}
            isDetails
          />
        ) : undefined}

        {buildingsFloorArea.NEIGHBOURHOOD_FACILITIES_AND_SERVICES ? (
          <DataLine
            label={getLabelForBuildingFloorArea("NEIGHBOURHOOD_FACILITIES_AND_SERVICES")}
            value={formatSurfaceArea(buildingsFloorArea.NEIGHBOURHOOD_FACILITIES_AND_SERVICES)}
            isDetails
          />
        ) : undefined}

        {buildingsFloorArea.PUBLIC_FACILITIES ? (
          <DataLine
            label={getLabelForBuildingFloorArea("PUBLIC_FACILITIES")}
            value={formatSurfaceArea(buildingsFloorArea.PUBLIC_FACILITIES)}
            isDetails
          />
        ) : undefined}

        {placesOfEconomicActivitySurfaceArea > 0 ? (
          <>
            <h4 className="tw-text-base tw-pb-2 tw-pt-4 tw-mb-0">Lieux d’activité économique</h4>

            <DataLine
              noBorder
              label="Espaces à aménager"
              value={<strong>{formatSurfaceArea(placesOfEconomicActivitySurfaceArea)}</strong>}
            />
            {buildingsFloorArea.GROUND_FLOOR_RETAIL ? (
              <DataLine
                label={` ➔ ${getLabelForBuildingFloorArea("GROUND_FLOOR_RETAIL")}`}
                value={formatSurfaceArea(buildingsFloorArea.GROUND_FLOOR_RETAIL)}
                isDetails
              />
            ) : undefined}
            {buildingsFloorArea.TERTIARY_ACTIVITIES ? (
              <DataLine
                label={` ➔ ${getLabelForBuildingFloorArea("TERTIARY_ACTIVITIES")}`}
                value={formatSurfaceArea(buildingsFloorArea.TERTIARY_ACTIVITIES)}
                isDetails
              />
            ) : undefined}

            {buildingsFloorArea.OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS ? (
              <DataLine
                label={` ➔ ${getLabelForBuildingFloorArea("OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS")}`}
                value={formatSurfaceArea(
                  buildingsFloorArea.OTHER_COMMERCIAL_OR_ARTISANAL_BUILDINGS,
                )}
                isDetails
              />
            ) : undefined}
            {buildingsFloorArea.SHIPPING_OR_INDUSTRIAL_BUILDINGS ? (
              <DataLine
                label={` ➔ ${getLabelForBuildingFloorArea("SHIPPING_OR_INDUSTRIAL_BUILDINGS")}`}
                value={formatSurfaceArea(buildingsFloorArea.SHIPPING_OR_INDUSTRIAL_BUILDINGS)}
                isDetails
              />
            ) : undefined}
          </>
        ) : undefined}
      </Section>
    </>
  );
};

export default UrbanProjectBuildingsSection;

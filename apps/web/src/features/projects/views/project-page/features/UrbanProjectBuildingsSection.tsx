import { sumObjectValues, typedObjectEntries } from "shared";

import { UrbanProjectFeatures } from "@/features/projects/domain/projects.types";
import { formatSurfaceArea } from "@/shared/core/format-number/formatNumber";
import { getLabelForBuildingFloorArea } from "@/shared/core/urbanProject";
import DataLine from "@/shared/views/components/FeaturesList/FeaturesListDataLine";
import Section from "@/shared/views/components/FeaturesList/FeaturesListSection";

type Props = { buildingsFloorArea: UrbanProjectFeatures["buildingsFloorArea"] };

const UrbanProjectBuildingsSection = ({ buildingsFloorArea }: Props) => {
  return (
    <Section title="🏘 Bâtiments">
      <DataLine
        noBorder
        label={<strong>Surface de plancher des bâtiments</strong>}
        value={formatSurfaceArea(sumObjectValues(buildingsFloorArea))}
      />
      <h4 className="tw-text-base tw-pb-2 tw-pt-4 tw-mb-0">Usage des bâtiments</h4>
      {typedObjectEntries(buildingsFloorArea).map(([use, value]) =>
        value ? (
          <DataLine
            key={use}
            label={getLabelForBuildingFloorArea(use)}
            value={formatSurfaceArea(value)}
            isDetails
          />
        ) : undefined,
      )}
    </Section>
  );
};

export default UrbanProjectBuildingsSection;

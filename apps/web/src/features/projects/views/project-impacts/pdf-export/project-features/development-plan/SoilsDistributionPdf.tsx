import { Text, View } from "@react-pdf/renderer";
import { SoilType, sumListWithKey } from "shared";

import { getLabelForSoilType } from "@/shared/core/label-mapping/soilTypeLabelMapping";
import { getColorForSoilType, sortAndAggregateProjectSoilDistribution } from "@/shared/core/soils";

import DataLine from "../../components/DataLine";
import FeaturesSection from "../../components/FeaturesSection";
import { formatSurfaceAreaPdf } from "../../format";
import { tw } from "../../styles";

type Props = {
  soilsDistribution: { soilType: SoilType; surfaceArea: number }[];
};

export default function SoilsDistributionPdf({ soilsDistribution }: Props) {
  const totalSurfaceArea = sumListWithKey(soilsDistribution, "surfaceArea");
  return (
    <FeaturesSection title="Répartition des sols">
      <DataLine
        label="Superficie totale"
        value={formatSurfaceAreaPdf(totalSurfaceArea)}
        noBorder
        bold
      />
      <View>
        <View style={tw("border-solid border-l-black border-l")}>
          {sortAndAggregateProjectSoilDistribution(soilsDistribution).map(
            ({ soilType, surfaceArea }) => {
              return (
                <DataLine
                  noBorder
                  label={
                    <View style={tw("flex flex-row items-center")}>
                      <View
                        style={[
                          tw("mx-2 h-4 w-4 rounded-sm"),
                          { backgroundColor: getColorForSoilType(soilType) },
                        ]}
                      ></View>
                      <Text>{getLabelForSoilType(soilType)}</Text>
                    </View>
                  }
                  value={formatSurfaceAreaPdf(surfaceArea ?? 0)}
                  key={soilType}
                />
              );
            },
          )}
        </View>
      </View>
    </FeaturesSection>
  );
}

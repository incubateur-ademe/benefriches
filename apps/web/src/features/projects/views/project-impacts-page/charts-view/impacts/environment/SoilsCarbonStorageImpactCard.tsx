import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { SoilType } from "shared";
import ImpactAbsoluteVariation from "../../ImpactChartCard/ImpactAbsoluteVariation";
import ImpactCard from "../../ImpactChartCard/ImpactChartCard";
import ImpactPercentageVariation from "../../ImpactChartCard/ImpactPercentageVariation";

import { ReconversionProjectImpacts } from "@/features/projects/domain/impacts.types";
import { formatCO2Impact } from "@/features/projects/views/shared/formatImpactValue";
import { baseAreaChartConfig } from "@/features/projects/views/shared/sharedChartConfig.ts";
import { getColorForCarbonStorageSoilType } from "@/shared/domain/soils";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";
import { getPercentageDifference } from "@/shared/services/percentage/percentage";
import { roundTo2Digits } from "@/shared/services/round-numbers/roundNumbers";
import HighchartsCustomColorsWrapper from "@/shared/views/components/Charts/HighchartsCustomColorsWrapper";

type Props = {
  soilsCarbonStorageImpact: ReconversionProjectImpacts["soilsCarbonStorage"];
  onTitleClick: () => void;
};

const getData = (
  soilType: SoilType,
  currentCarbonStorage: ReconversionProjectImpacts["soilsCarbonStorage"]["current"]["soils"],
  projectedCarbonStorage: ReconversionProjectImpacts["soilsCarbonStorage"]["forecast"]["soils"],
) => {
  const soilTypeInSite = currentCarbonStorage.find((storage) => storage.type === soilType);
  const soilTypeInProject = projectedCarbonStorage.find((storage) => storage.type === soilType);
  return [
    roundTo2Digits(soilTypeInSite?.carbonStorage ?? 0),
    roundTo2Digits(soilTypeInProject?.carbonStorage ?? 0),
  ];
};

const getMergedSoilTypes = (
  current: ReconversionProjectImpacts["soilsCarbonStorage"]["current"]["soils"],
  projected: ReconversionProjectImpacts["soilsCarbonStorage"]["forecast"]["soils"],
) => Array.from(new Set([...current, ...projected].map(({ type }) => type)));

function SoilsCarbonStorageImpactCard({ soilsCarbonStorageImpact, onTitleClick }: Props) {
  const currentSoilsCarbonStorage = soilsCarbonStorageImpact.current;
  const forecastSoilsCarbonStorage = soilsCarbonStorageImpact.forecast;
  const soilsTypes = getMergedSoilTypes(
    currentSoilsCarbonStorage.soils,
    forecastSoilsCarbonStorage.soils,
  );

  const chartOptions: Highcharts.Options = {
    ...baseAreaChartConfig,
    xAxis: {
      labels: { enabled: false },
      categories: ["Pas de changement", "Centrale photovoltaïque"],
    },
    tooltip: {
      valueSuffix: " tonnes stockées",
    },
    plotOptions: {
      area: {
        ...baseAreaChartConfig.plotOptions?.area,
        stacking: "normal",
      },
    },
    legend: { enabled: false },
    series: soilsTypes.map((soilType) => ({
      name: getLabelForSoilType(soilType),
      type: "area",
      data: getData(soilType, currentSoilsCarbonStorage.soils, forecastSoilsCarbonStorage.soils),
    })),
  };

  const soilsCarbonStorageVariation =
    forecastSoilsCarbonStorage.total - currentSoilsCarbonStorage.total;
  const percentageVariation = getPercentageDifference(
    currentSoilsCarbonStorage.total,
    forecastSoilsCarbonStorage.total,
  );

  return (
    <ImpactCard title="🍂 Carbone stocké dans les sols" onTitleClick={onTitleClick}>
      <ImpactPercentageVariation percentage={percentageVariation} />
      <ImpactAbsoluteVariation>
        {formatCO2Impact(soilsCarbonStorageVariation)}
      </ImpactAbsoluteVariation>
      <HighchartsCustomColorsWrapper
        colors={soilsTypes.map((soilType) => getColorForCarbonStorageSoilType(soilType))}
      >
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </HighchartsCustomColorsWrapper>
    </ImpactCard>
  );
}

export default SoilsCarbonStorageImpactCard;

import { useMemo } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { SoilType } from "shared";
import { baseColumnChartConfig } from "../../../shared/sharedChartConfig";

import { SoilsCarbonStorage } from "@/features/projects/application/projectImpactsComparison.reducer";
import { getColorForSoilType } from "@/shared/domain/soils";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";
import { roundTo2Digits } from "@/shared/services/round-numbers/roundNumbers";

type Props = {
  currentCarbonStorage: SoilsCarbonStorage;
  projectedCarbonStorage: SoilsCarbonStorage;
};

const getData = (
  soilType: SoilType,
  currentCarbonStorage: SoilsCarbonStorage["soilsStorage"],
  projectedCarbonStorage: SoilsCarbonStorage["soilsStorage"],
) => {
  const soilTypeInSite = currentCarbonStorage.find((storage) => storage.type === soilType);
  const soilTypeInProject = projectedCarbonStorage.find((storage) => storage.type === soilType);
  return [
    roundTo2Digits(soilTypeInSite?.carbonStorage ?? 0),
    roundTo2Digits(soilTypeInProject?.carbonStorage ?? 0),
  ];
};

const getMergedSoilTypes = (
  current: SoilsCarbonStorage["soilsStorage"],
  projected: SoilsCarbonStorage["soilsStorage"],
) => Array.from(new Set([...current, ...projected].map(({ type }) => type)));

function CarbonStorageComparisonChart({ currentCarbonStorage, projectedCarbonStorage }: Props) {
  const soilsTypes = useMemo(
    () =>
      getMergedSoilTypes(currentCarbonStorage.soilsStorage, projectedCarbonStorage.soilsStorage),
    [currentCarbonStorage, projectedCarbonStorage],
  );

  const barChartOptions: Highcharts.Options = {
    ...baseColumnChartConfig,
    chart: {
      ...baseColumnChartConfig.chart,
      height: "400",
    },
    xAxis: {
      categories: ["Pas de changement", "Centrale photovoltaïque"],
    },
    tooltip: {
      valueSuffix: " tonnes stockées",
    },
    plotOptions: {
      column: {
        stacking: "normal",
        pointPadding: 0.05,
        borderWidth: 0,
        dataLabels: { enabled: true, format: "{point.y:,.0f} t" },
      },
    },
    series: soilsTypes.map((soilType) => ({
      name: getLabelForSoilType(soilType),
      type: "column",
      color: getColorForSoilType(soilType),
      data: getData(
        soilType,
        currentCarbonStorage.soilsStorage,
        projectedCarbonStorage.soilsStorage,
      ),
    })),
  };

  return (
    <div>
      <p>
        <strong>Stockage du carbone dans les sols</strong>
      </p>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default CarbonStorageComparisonChart;

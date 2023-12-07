import { useMemo } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { sharedChartConfig } from "../../../shared/sharedChartConfig";

import { ProjectImpactsComparisonState } from "@/features/projects/application/projectImpactsComparison.reducer";
import { SoilType } from "@/shared/domain/soils";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";

type Props = {
  currentCarbonStorage: Exclude<
    ProjectImpactsComparisonState["currentCarbonStorage"],
    undefined
  >;
  projectedCarbonStorage: Exclude<
    ProjectImpactsComparisonState["projectedCarbonStorage"],
    undefined
  >;
};

const getData = (
  soilType: SoilType,
  currentCarbonStorage: Props["currentCarbonStorage"]["soilsStorage"],
  projectedCarbonStorage: Props["projectedCarbonStorage"]["soilsStorage"],
) => {
  const soilTypeInSite = currentCarbonStorage.find(
    (storage) => storage.type === soilType,
  );
  const soilTypeInProject = projectedCarbonStorage.find(
    (storage) => storage.type === soilType,
  );
  return [
    Math.round(soilTypeInSite?.carbonStorage ?? 0 * 100) / 100,
    Math.round(soilTypeInProject?.carbonStorage ?? 0 * 100) / 100,
  ];
};

function CarbonStorageComparisonChart({
  currentCarbonStorage,
  projectedCarbonStorage,
}: Props) {
  const soilsTypes = useMemo(
    () =>
      [
        ...currentCarbonStorage.soilsStorage,
        ...projectedCarbonStorage.soilsStorage,
      ].map(({ type }) => type),
    [currentCarbonStorage, projectedCarbonStorage],
  );

  const barChartOptions: Highcharts.Options = {
    ...sharedChartConfig,
    chart: {
      ...sharedChartConfig.chart,
      height: "400",
    },
    xAxis: {
      categories: ["Pas de changement", "Centrale photovoltaïque"],
      crosshair: false,
    },
    tooltip: {
      valueSuffix: " tonnes stockées",
    },
    plotOptions: {
      column: {
        stacking: "normal",
        pointPadding: 0.05,
        borderWidth: 0,
        dataLabels: { enabled: true, format: "{point.y} t" },
      },
    },
    series: soilsTypes.map((soilType) => ({
      name: getLabelForSoilType(soilType),
      type: "column",
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

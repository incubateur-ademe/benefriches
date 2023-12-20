import { useMemo } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { sharedChartConfig } from "../../../shared/sharedChartConfig";

import { ProjectImpactsComparisonState } from "@/features/projects/application/projectImpactsComparison.reducer";
import { SoilType } from "@/shared/domain/soils";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";

type CurrentCarbonStorageType = Exclude<
  ProjectImpactsComparisonState["currentCarbonStorage"],
  undefined
>;

type ProjectedCarbonStorageType = Exclude<
  ProjectImpactsComparisonState["currentCarbonStorage"],
  undefined
>;

type Props = {
  currentCarbonStorage: CurrentCarbonStorageType;
  projectedCarbonStorage: ProjectedCarbonStorageType;
};

const roundTo2Digits = (value: number) => {
  return Math.round(value * 100) / 100;
};

const getData = (
  soilType: SoilType,
  currentCarbonStorage: CurrentCarbonStorageType["soilsStorage"],
  projectedCarbonStorage: ProjectedCarbonStorageType["soilsStorage"],
) => {
  const soilTypeInSite = currentCarbonStorage.find(
    (storage) => storage.type === soilType,
  );
  const soilTypeInProject = projectedCarbonStorage.find(
    (storage) => storage.type === soilType,
  );
  return [
    roundTo2Digits(soilTypeInSite?.carbonStorage ?? 0),
    roundTo2Digits(soilTypeInProject?.carbonStorage ?? 0),
  ];
};

const getMergedSoilTypes = (
  current: CurrentCarbonStorageType["soilsStorage"],
  projected: ProjectedCarbonStorageType["soilsStorage"],
) => Array.from(new Set([...current, ...projected].map(({ type }) => type)));

function CarbonStorageComparisonChart({
  currentCarbonStorage,
  projectedCarbonStorage,
}: Props) {
  const soilsTypes = useMemo(
    () =>
      getMergedSoilTypes(
        currentCarbonStorage.soilsStorage,
        projectedCarbonStorage.soilsStorage,
      ),
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

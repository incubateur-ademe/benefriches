/* eslint-disable */
import { useMemo } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { baseAreaChartConfig } from "../../../shared/sharedChartConfig";

import { getColorForSoilType, SoilType } from "@/shared/domain/soils";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";
import { SoilsCarbonStorageResult } from "@/features/projects/application/fetchReconversionProjectCarbonStorageImpact.action";
import { roundTo2Digits } from "@/shared/services/round-numbers/roundNumbers";

type Props = {
  currentCarbonStorage: SoilsCarbonStorageResult;
  projectedCarbonStorage: SoilsCarbonStorageResult;
};

const getData = (
  soilType: SoilType,
  currentCarbonStorage: SoilsCarbonStorageResult["soilsStorage"],
  projectedCarbonStorage: SoilsCarbonStorageResult["soilsStorage"],
) => {
  const soilTypeInSite = currentCarbonStorage.find((storage) => storage.type === soilType);
  const soilTypeInProject = projectedCarbonStorage.find((storage) => storage.type === soilType);
  return [
    roundTo2Digits(soilTypeInSite?.carbonStorage ?? 0),
    roundTo2Digits(soilTypeInProject?.carbonStorage ?? 0),
  ];
};

const getMergedSoilTypes = (
  current: SoilsCarbonStorageResult["soilsStorage"],
  projected: SoilsCarbonStorageResult["soilsStorage"],
) => Array.from(new Set([...current, ...projected].map(({ type }) => type)));

function CarbonStorageChart({ currentCarbonStorage, projectedCarbonStorage }: Props) {
  const soilsTypes = useMemo(
    () =>
      getMergedSoilTypes(currentCarbonStorage.soilsStorage, projectedCarbonStorage.soilsStorage),
    [currentCarbonStorage, projectedCarbonStorage],
  );

  const barChartOptions: Highcharts.Options = {
    ...baseAreaChartConfig,
    chart: {
      ...baseAreaChartConfig.chart,
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
      area: {
        stacking: "normal",
        borderWidth: 0,
        dataLabels: { enabled: true, format: "{point.y:,.0f} t" },
      },
    },
    series: soilsTypes.map((soilType) => ({
      name: getLabelForSoilType(soilType),
      type: "area",
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
      <p>
        <strong>+150 t stockées</strong>
      </p>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default CarbonStorageChart;

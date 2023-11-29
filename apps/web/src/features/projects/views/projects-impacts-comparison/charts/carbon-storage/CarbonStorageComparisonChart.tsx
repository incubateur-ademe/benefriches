import { useMemo } from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { sharedChartConfig } from "../../../shared/sharedChartConfig";

import { ProjectAndSiteSoilsCarbonStorageResult } from "@/shared/application/actions/soilsCarbonStorage.actions";
import { SoilType } from "@/shared/domain/soils";
import { getLabelForSoilType } from "@/shared/services/label-mapping/soilTypeLabelMapping";

type TypeSiteSoilsStorage =
  ProjectAndSiteSoilsCarbonStorageResult["siteCarbonStorage"]["soilsStorage"];
type TypeProjectSoilsStorage =
  ProjectAndSiteSoilsCarbonStorageResult["siteCarbonStorage"]["soilsStorage"];
type Props = {
  siteSoilsStorage: TypeSiteSoilsStorage;
  projectSoilsStorage: TypeProjectSoilsStorage;
};

const getData = (
  soilType: SoilType,
  siteSoilsStorage: TypeSiteSoilsStorage,
  projectSoilsStorage: TypeProjectSoilsStorage,
) => {
  const soilTypeInSite = siteSoilsStorage.find(
    (storage) => storage.type === soilType,
  );
  const soilTypeInProject = projectSoilsStorage.find(
    (storage) => storage.type === soilType,
  );
  return [
    Math.round(soilTypeInSite?.carbonStorage ?? 0 * 100) / 100,
    Math.round(soilTypeInProject?.carbonStorage ?? 0 * 100) / 100,
  ];
};

function CarbonStorageComparisonChart({
  siteSoilsStorage,
  projectSoilsStorage,
}: Props) {
  const soilsTypes = useMemo(
    () =>
      [...(siteSoilsStorage ?? []), ...(projectSoilsStorage ?? [])].map(
        ({ type }) => type,
      ),
    [projectSoilsStorage, siteSoilsStorage],
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
      data: getData(soilType, siteSoilsStorage, projectSoilsStorage),
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

import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/modules/variable-pie";
import { useId, useRef } from "react";
import { SoilType } from "shared";

import { getLabelForSoilType } from "@/shared/core/label-mapping/soilTypeLabelMapping";
import { getColorForCarbonStorageSoilType } from "@/shared/core/soils";

import { withDefaultPieChartOptions } from "../../charts";
import { useChartCustomPointColors } from "../../charts/useChartCustomColors";
import ExportableChart from "./ExportableChart";

type Props = {
  soilsCarbonStorage: {
    type: SoilType;
    surfaceArea: number;
    carbonStorage: number;
    carbonStorageInTonPerSquareMeters: number;
  }[];
  customHeight?: number | string;
  mode?: "legend" | "label" | "plain";
  exportConfig?: {
    title?: string;
    subtitle?: string;
    caption?: string;
  };
};

const SoilsCarbonStorageChart = ({
  soilsCarbonStorage,
  customHeight = "300px",
  mode = "label",
  exportConfig,
}: Props) => {
  const variablePieChartRef = useRef<HighchartsReact.RefObject>(null);

  const soilsData = soilsCarbonStorage.filter(({ surfaceArea }) => surfaceArea > 0);

  const variablePieChartOptions: Highcharts.Options = withDefaultPieChartOptions({
    chart: {
      height: customHeight,
      type: "variablepie",
    },
    tooltip: {
      distance: 40,
      pointFormat:
        "Stocke <strong>{point.carbonStorage:,.1f} t de carbone </strong><br>" +
        "Superficie : {point.y:,.2f} m²<br>" +
        "Carbone stockable / m² : {point.z:.3f} t",
    },
    plotOptions: {
      variablepie:
        mode === "legend"
          ? {
              dataLabels: { enabled: false },
              showInLegend: true,
              allowPointSelect: false,
            }
          : { dataLabels: { enabled: mode === "label" } },
    },
    legend:
      mode === "legend"
        ? {
            labelFormatter: function () {
              const value = soilsData[this.index];
              if (value) {
                return `
            ${this.name} : ${value.carbonStorage} t de carbone`;
              }
              return this.name;
            },
          }
        : { enabled: false },
    series: [
      {
        name: "",
        type: "variablepie",
        zMin: 0,
        data: soilsData.map((soilData) => ({
          name: getLabelForSoilType(soilData.type),
          z: soilData.carbonStorageInTonPerSquareMeters,
          y: soilData.surfaceArea,
          carbonStorage: soilData.carbonStorage,
        })),
      },
    ],
  });

  const id = useId();

  useChartCustomPointColors(
    id,
    soilsData.map((soilData) => getColorForCarbonStorageSoilType(soilData.type)),
  );

  return (
    <ExportableChart
      containerProps={{ id }}
      highcharts={Highcharts}
      options={variablePieChartOptions}
      exportingOptions={{
        title: exportConfig?.title ?? "Répartition du stockage du carbone dans les sols",
        subtitle: exportConfig?.subtitle,
        caption: exportConfig?.caption,
        csvColumnHeader: { y: "Superficie en m²", z: "Carbone stockable en tonnes / m²" },
        colors: soilsData.map((soilData) => getColorForCarbonStorageSoilType(soilData.type)),
        chartOptions: {
          plotOptions: {
            variablepie: {
              dataLabels: {
                enabled: mode !== "legend",
                style: { fontSize: "12px", fontWeight: "400" },
                format: `{point.name} ({point.carbonStorage:,.1f} t)`,
              },
            },
          },
        },
      }}
      ref={variablePieChartRef}
    />
  );
};

export default SoilsCarbonStorageChart;

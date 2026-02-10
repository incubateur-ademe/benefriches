import { fr } from "@codegouvfr/react-dsfr";
import HighchartsReact from "highcharts-react-official";
import { useId, useRef } from "react";
import { SoilsDistribution, typedObjectEntries } from "shared";

import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/core/format-number/formatNumber";
import { getLabelForSoilType } from "@/shared/core/label-mapping/soilTypeLabelMapping";
import { getColorForSoilType } from "@/shared/core/soils";
import { sortByKey } from "@/shared/core/sort/sortByKey";

import { withDefaultPieChartOptions } from "../../charts";
import { useChartCustomPointColors } from "../../charts/useChartCustomColors";
import ExportableChart from "./ExportableChart";

type Props = {
  soilsDistribution: SoilsDistribution;
  remainderSurfaceArea?: number;
  customHeight?: number | string;
  mode?: "legend" | "label" | "plain";
  exportConfig?: {
    title?: string;
    subtitle?: string;
    caption?: string;
  };
};

const SurfaceAreaPieChart = ({
  soilsDistribution,
  remainderSurfaceArea,
  customHeight = "300px",
  mode = "label",
  exportConfig,
}: Props) => {
  const variablePieChartRef = useRef<HighchartsReact.RefObject>(null);
  const soilsEntries = typedObjectEntries(soilsDistribution).filter(
    ([, surfaceArea]) => (surfaceArea as number) > 0,
  );

  const data = sortByKey(
    soilsEntries.map(([soilType, surfaceArea]) => ({
      name: getLabelForSoilType(soilType),
      y: surfaceArea,
      color: getColorForSoilType(soilType),
    })),
    "name",
  );

  if (remainderSurfaceArea) {
    data.push({
      name: "Non assigné",
      y: remainderSurfaceArea,
      color: fr.colors.decisions.border.disabled.grey.default,
    });
  }

  const variablePieChartOptions: Highcharts.Options = withDefaultPieChartOptions({
    chart: {
      height: customHeight,
    },
    tooltip: {
      pointFormat: `Superficie : <strong>{point.y:,.2f} ${SQUARE_METERS_HTML_SYMBOL}</strong> ({point.percentage:.2f}%)`,
    },
    plotOptions: {
      pie:
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
              const value = data[this.index];
              if (value) {
                return `
            ${this.name} : ${value.y} ${SQUARE_METERS_HTML_SYMBOL}`;
              }
              return this.name;
            },
          }
        : { enabled: false },
    series: [
      {
        name: "Superficie",
        type: "pie",
        data,
      },
    ],
  });

  const containerId = useId();

  useChartCustomPointColors(
    containerId,
    data.map(({ color }) => color),
  );

  return (
    <ExportableChart
      containerProps={{ id: containerId }}
      options={variablePieChartOptions}
      ref={variablePieChartRef}
      exportingOptions={{
        title: exportConfig?.title ?? "Répartition de l'occupation des sols",
        subtitle: exportConfig?.subtitle ?? "",
        caption: exportConfig?.caption,
        csvColumnHeader: { y: "Superficie en m²" },
        colors: data.map(({ color }) => color),
        chartOptions: {
          plotOptions: {
            pie: {
              dataLabels: {
                enabled: mode !== "legend",
                style: { fontSize: "12px", fontWeight: "400" },
                format: `{point.name} ({point.y:,.2f} ${SQUARE_METERS_HTML_SYMBOL})`,
              },
            },
          },
        },
      }}
    />
  );
};

export default SurfaceAreaPieChart;

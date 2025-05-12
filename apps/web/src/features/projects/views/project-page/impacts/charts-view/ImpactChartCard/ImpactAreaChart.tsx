import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useId } from "react";

import {
  formatCO2Impact,
  formatDefaultImpact,
  formatETPImpact,
  formatSurfaceAreaImpact,
} from "@/features/projects/views/shared/formatImpactValue";
import { withDefaultAreaChartOptions } from "@/shared/views/charts";
import { useChartCustomSerieColors } from "@/shared/views/charts/useChartCustomColors";

export type ImpactAreaChartProps = {
  title: string;
  base: number;
  forecast: number;
  difference: number;
  color?: string;
  details?: { label: string; base: number; forecast: number; difference: number; color?: string }[];
  type?: "co2" | "surfaceArea" | "etp" | "default";
  height?: number;
};

const impactTypeFormatterMap = {
  co2: {
    formatFn: formatCO2Impact,
    unitSuffix: "",
  },
  surfaceArea: {
    formatFn: formatSurfaceAreaImpact,
    unitSuffix: "",
  },
  etp: {
    formatFn: formatETPImpact,
    unitSuffix: "ETP",
  },
  default: {
    formatFn: formatDefaultImpact,
    unitSuffix: "",
  },
} as const;

const ImpactAreaChart = ({
  base,
  forecast,
  difference,
  color,
  details,
  title,
  type = "default",
  height = 220,
}: ImpactAreaChartProps) => {
  const chartContainerId = useId();

  const { formatFn, unitSuffix } = impactTypeFormatterMap[type];

  const baseValueText = `${formatFn(base, { withSignPrefix: false })} ${unitSuffix}`;
  const forecastValueText = `${formatFn(forecast, { withSignPrefix: false })} ${unitSuffix}`;

  const data = details?.filter(({ difference }) => difference !== 0) ?? [
    {
      label: title,
      base,
      forecast,
      difference,
      color,
    },
  ];

  useChartCustomSerieColors(
    chartContainerId,
    data.map(({ color }) => color),
  );

  return (
    <HighchartsReact
      highcharts={Highcharts}
      containerProps={{ id: chartContainerId }}
      options={withDefaultAreaChartOptions({
        chart: {
          height: height,
        },
        xAxis: {
          categories: ["Sans le projet", "Avec le projet"],
          labels: {
            useHTML: true,
            formatter: function () {
              return `<strong>${this.value}</strong><br>${this.isFirst ? baseValueText : forecastValueText}`;
            },
          },
        },
        series: data.map(({ label, base, forecast, color }) => ({
          name: label,
          type: "area",
          color,
          data: [base, forecast],
        })) as Array<Highcharts.SeriesOptionsType>,
      })}
    />
  );
};

export default ImpactAreaChart;

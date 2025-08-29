import { useId } from "react";

import { formatEvolutionPercentage } from "@/features/projects/views/shared/formatImpactValue";
import { getPercentageDifference } from "@/shared/core/percentage/percentage";
import { withDefaultAreaChartOptions } from "@/shared/views/charts";
import { useChartCustomSerieColors } from "@/shared/views/charts/useChartCustomColors";

import {
  formatCO2Impact,
  formatDefaultImpact,
  formatETPImpact,
  formatSurfaceAreaImpact,
} from "../formatImpactValue";

export type ImpactAreaChartProps = {
  title: string;
  base: number;
  forecast: number;
  difference: number;
  color?: string;
  details?: { label: string; base: number; forecast: number; difference: number; color?: string }[];
  type?: "co2" | "surface_area" | "etp" | "default";
  height?: number;
};

const impactTypeFormatterMap = {
  co2: {
    formatFn: formatCO2Impact,
    unitSuffix: "",
  },
  surface_area: {
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

const useImpactAreaChartProps = ({
  type = "default",
  details,
  base,
  forecast,
  title,
  difference,
  color,
  height = 200,
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

  const colors = data.map(({ color }) => color);

  useChartCustomSerieColors(chartContainerId, colors);

  return {
    data,
    chartContainerId,
    formatFn,
    colors,
    options: withDefaultAreaChartOptions({
      chart: {
        height: height,
      },
      xAxis: {
        categories: ["Sans le projet", "Avec le projet"],
        labels: {
          useHTML: true,
          formatter: function () {
            const valueText = this.isFirst ? baseValueText : forecastValueText;
            if (this.isLast && base !== 0) {
              const percentageVariation = getPercentageDifference(base, forecast);
              const className =
                percentageVariation > 0
                  ? "bg-impacts-positive-light dark:text-black"
                  : "bg-impacts-negative-light dark:text-black";
              const percentage = `<span class="fr-badge normal-case font-normal rounded-xl px-2 fr-badge--sm ${className}">${formatEvolutionPercentage(getPercentageDifference(base, forecast))}</span>`;
              return `<strong>${this.value}</strong><br>${valueText} ${percentage}`;
            }
            return `<strong>${this.value}</strong><br>${valueText}`;
          },
        },
      },
      series: data.map(({ label, base, forecast }) => ({
        name: label,
        type: "area",
        data: [base, forecast],
      })) as Array<Highcharts.SeriesOptionsType>,
    }),
  };
};

export default useImpactAreaChartProps;

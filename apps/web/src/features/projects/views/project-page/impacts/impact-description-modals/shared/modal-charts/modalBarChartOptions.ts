import { Options, SeriesOptionsType } from "highcharts";

import { withDefaultBarChartOptions } from "@/shared/views/charts";

import { formatModalBarChartValue, extractEmoji, ValueFormat } from "./modalBarChartValueFormat";

type Props = {
  valueFormat: ValueFormat;
  nbColumns: number;
  noTooltip?: boolean;
  colorByPoint?: boolean;
  categories: { label: string; total: number }[];
  series: Array<SeriesOptionsType>;
  onChartReady: () => void;
};

const labelFormatter = ({
  label,
  total,
  nbColumns,
  valueFormat,
}: Pick<Props, "nbColumns" | "valueFormat"> & Props["categories"][number]) => {
  if (nbColumns < 5) {
    return `<strong class="line-clamp-1">${label}</strong><br>${formatModalBarChartValue(total, valueFormat)}`;
  }

  const emoji = extractEmoji(label);

  if (nbColumns < 7) {
    const spanLabel = emoji
      ? `<span class="text-xl">${emoji}</span>`
      : `<strong class="line-clamp-1">${label}</strong>`;

    return `${spanLabel}<br>${formatModalBarChartValue(total, valueFormat, {
      notation: "compact",
      compactDisplay: "short",
    })}`;
  }

  return `<span class="text-xl">${emoji}</span>`;
};

export const getBarChartOptions = ({
  nbColumns,
  colorByPoint = false,
  categories,
  valueFormat,
  series,
  onChartReady,
}: Props): Options =>
  withDefaultBarChartOptions({
    xAxis: {
      categories: categories.map(({ label }) => label),
      labels: {
        useHTML: true,
        formatter: function () {
          return labelFormatter({
            label: this.value.toString(),
            total: categories[this.pos]?.total ?? 0,
            nbColumns,
            valueFormat,
          });
        },
      },
    },
    tooltip: {
      enabled: false,
    },
    chart: {
      height: 400,
    },
    plotOptions: {
      column: {
        stacking: "normal",
        dataLabels: {
          enabled: false,
        },
        colorByPoint,
        ...(nbColumns > 4 ? { groupPadding: 0 } : {}),
      },
      series: {
        enableMouseTracking: false,
        animation: {
          complete: function () {
            onChartReady();
          },
        },
      },
    },
    legend: {
      enabled: false,
    },
    series,
  });

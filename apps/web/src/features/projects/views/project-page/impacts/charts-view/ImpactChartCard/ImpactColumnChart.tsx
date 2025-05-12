import * as Highcharts from "highcharts";
import { Options } from "highcharts";
import HighchartsReact, { HighchartsReactProps } from "highcharts-react-official";
import { useId, useRef } from "react";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { withDefaultBarChartOptions } from "@/shared/views/charts";
import { useChartCustomPointColors } from "@/shared/views/charts/useChartCustomColors";

type Props = {
  data: {
    label: string;
    color?: string;
    value: number;
  }[];
  formatFn?: (value: number) => string;
} & HighchartsReactProps;

const barChartOptions: Options = withDefaultBarChartOptions({
  tooltip: {
    enabled: false,
  },
  plotOptions: {
    column: {
      stacking: "normal",
      dataLabels: {
        enabled: false,
      },
      colorByPoint: true,
    },
    series: {
      enableMouseTracking: false,
    },
  },
  legend: {
    enabled: false,
  },
});

const ImpactColumnChart = ({ data, formatFn = formatMonetaryImpact, ...props }: Props) => {
  const id = useId();
  const chartContainerId = `chart-${id}`;

  const chartRef = useRef<HighchartsReact.RefObject>(null);

  useChartCustomPointColors(
    chartContainerId,
    data.map(({ color }) => color),
  );

  return (
    <div id={chartContainerId}>
      <HighchartsReact
        highcharts={Highcharts}
        ref={chartRef}
        containerProps={{ className: "highcharts-no-xaxis" }}
        options={
          {
            ...barChartOptions,
            xAxis: {
              categories: data.map(({ label }) => label),
              labels: {
                formatter: function () {
                  return `<strong>${this.value}</strong><br>${formatFn(data[this.pos]?.value ?? 0)}`;
                },
              },
            },
            series: [
              {
                type: "column",
                data: data.map(({ value, label, color }) => ({
                  name: label,
                  y: value,
                  color,
                })),
              },
            ],
          } as Highcharts.Options
        }
        {...props}
      />
    </div>
  );
};

export default ImpactColumnChart;

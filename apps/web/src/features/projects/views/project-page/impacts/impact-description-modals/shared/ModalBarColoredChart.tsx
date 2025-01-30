import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { CSSProperties, HTMLAttributes } from "react";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { withDefaultBarChartOptions } from "@/shared/views/charts";
import classNames from "@/shared/views/clsx";

type Props = {
  formatFn?: (value: number) => string;
  data: {
    label: string;
    value: number;
    color?: string;
  }[];
} & HTMLAttributes<HTMLDivElement>;

const barChartOptions: Highcharts.Options = withDefaultBarChartOptions({
  tooltip: {
    enabled: false,
  },
  plotOptions: {
    column: {
      stacking: "normal",
      groupPadding: 0,
      borderRadius: 8,
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

const ModalBarColoredChart = ({ data, formatFn = formatMonetaryImpact, ...props }: Props) => {
  const style = Object.fromEntries(
    data.map(({ color }, index) => {
      return color ? [`--highcharts-color-${index}`, color] : [];
    }),
  ) as CSSProperties;

  return (
    <div style={style} className={classNames("tw-mb-6", props.className)} {...props}>
      <HighchartsReact
        highcharts={Highcharts}
        containerProps={{ className: "highcharts-no-xaxis" }}
        options={{
          ...barChartOptions,
          chart: {
            ...barChartOptions.chart,
            height: 480,
          },
          xAxis: {
            categories: data.map(
              ({ label, value }) => `
                <strong>${label}</strong><br><br>
                ${formatFn(value)}
            `,
            ),
          },

          series: [
            {
              type: "column",
              data: data.map(({ value, label }) => ({
                name: label,
                y: value,
              })),
            },
          ] as Array<Highcharts.SeriesOptionsType>,
        }}
      />
    </div>
  );
};

export default ModalBarColoredChart;

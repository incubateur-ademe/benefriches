import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { CSSProperties, HTMLAttributes, ReactNode, useState } from "react";

import { withDefaultBarChartOptions } from "@/shared/views/charts";

type Props = {
  data: {
    label: ReactNode;
    values: [number, number];
    color?: string;
  }[];
  categoryLabels: [string, string];
} & HTMLAttributes<HTMLDivElement>;

const barChartOptions: Highcharts.Options = withDefaultBarChartOptions({
  tooltip: {
    enabled: false,
  },
  plotOptions: {
    column: {
      stacking: "normal",
    },
    series: {
      enableMouseTracking: false,
    },
  },
  legend: {
    enabled: false,
  },
});

const ImpactBarColoredBalanceChart = ({ data, categoryLabels, ...props }: Props) => {
  const [onHovered, setOnHovered] = useState(false);

  const leftValues = data.map(({ values }) => Math.abs(values[0]));
  const maxLeft = Math.max(...leftValues);
  const mainLeftColor = data[leftValues.indexOf(maxLeft)]?.color;

  const rightValues = data.map(({ values }) => Math.abs(values[1]));
  const maxRight = Math.max(...rightValues);
  const mainRightColor = data[rightValues.indexOf(maxRight)]?.color;

  const style = Object.fromEntries(
    data.map(({ color, values }, index) => {
      if (onHovered) {
        return color ? [`--highcharts-color-${index}`, color] : [];
      }
      const isLeft = values[0] !== 0;
      const mainColor = isLeft ? mainLeftColor : mainRightColor;
      return mainColor ? [`--highcharts-color-${index}`, mainColor] : [];
    }),
  ) as CSSProperties;

  return (
    <div
      style={style}
      className="highcharts-same-color-before-hover"
      onMouseEnter={() => {
        setOnHovered(true);
      }}
      onMouseLeave={() => {
        setOnHovered(false);
      }}
      {...props}
    >
      <HighchartsReact
        highcharts={Highcharts}
        containerProps={{ className: "highcharts-no-xaxis" }}
        options={{
          ...barChartOptions,
          xAxis: {
            categories: categoryLabels,
          },
          series: data.map(({ values, label }) => ({
            name: label,
            data: values,
            type: "column",
          })) as Array<Highcharts.SeriesOptionsType>,
        }}
      />
    </div>
  );
};

export default ImpactBarColoredBalanceChart;

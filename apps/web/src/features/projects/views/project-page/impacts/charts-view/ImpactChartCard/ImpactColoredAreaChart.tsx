import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { CSSProperties, HTMLAttributes, ReactNode, useMemo, useState } from "react";

import { baseAreaChartConfig } from "@/features/projects/views/shared/sharedChartConfig.ts";

type Props = {
  data: {
    label: ReactNode;
    values: [number, number];
    color?: string;
  }[];
  categoryLabels: [string, string];
} & HTMLAttributes<HTMLDivElement>;

const barAreaChartOptions: Highcharts.Options = {
  ...baseAreaChartConfig,
  xAxis: {
    labels: { enabled: true },
    categories: [],
  },
  tooltip: {
    enabled: false,
  },
  plotOptions: {
    area: {
      ...baseAreaChartConfig.plotOptions?.area,
      stacking: "normal",
      marker: { enabled: false, states: { hover: { enabled: false } } },
    },
    series: {
      enableMouseTracking: false,
    },
  },
  legend: { enabled: false },
};

const ImpactColoredAreaChart = ({ data, categoryLabels, ...props }: Props) => {
  const [onHovered, setOnHovered] = useState(false);

  const largestSectionColor = useMemo(() => {
    const differences = data.map(({ values }) => values[1] - values[0]);
    return data[differences.indexOf(Math.max(...differences))]?.color;
  }, [data]);

  const style = Object.fromEntries(
    data.map(({ color }, index) => {
      const mainColor = largestSectionColor
        ? [`--highcharts-color-${index}`, largestSectionColor]
        : [];
      const onHoverColor = color ? [`--highcharts-color-${index}`, color] : [];
      return onHovered ? onHoverColor : mainColor;
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
        options={{
          ...barAreaChartOptions,
          xAxis: {
            ...barAreaChartOptions.xAxis,
            categories: categoryLabels,
          },
          series: data.map(({ label, values }) => ({
            name: label,
            type: "area",
            data: values,
          })) as Array<Highcharts.SeriesOptionsType>,
        }}
      />
    </div>
  );
};

export default ImpactColoredAreaChart;

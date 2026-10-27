import { type HighchartsReact, type HighchartsReactProps } from "highcharts-react-official";
import type { HTMLAttributes } from "react";
import { useId, useRef } from "react";

import { useChartCustomPointColors } from "@/shared/views/charts/useChartCustomColors";
import classNames from "@/shared/views/clsx";
import ExportableChart from "@/shared/views/components/Charts/ExportableChart";

import ModalColumnChartTooltip from "./ModalColumnChartTooltip";
import { getBarChartOptions } from "./modalBarChartOptions";
import type { ValueFormat } from "./modalBarChartValueFormat";
import { formatModalBarChartValue } from "./modalBarChartValueFormat";
import { useBarChartCustomTooltip } from "./useBarChartCustomTooltip";

export type ModalColumnPointChartProps = {
  format: ValueFormat;
  data: {
    label: string;
    value: number;
    color?: string;
  }[];
  exportTitle: string;
  exportSubtitle?: string;
  chartProps?: HighchartsReactProps & { ref?: React.RefObject<HighchartsReact.RefObject | null> };
} & HTMLAttributes<HTMLDivElement>;

const ModalColumnPointChart = ({
  data,
  format,
  exportTitle,
  exportSubtitle,
  chartProps,
  ...props
}: ModalColumnPointChartProps) => {
  const chartContainerId = useId();

  useChartCustomPointColors(
    chartContainerId,
    data.map(({ color }) => color),
  );

  const innerRef = useRef<HighchartsReact.RefObject>(null);
  const chartRef = chartProps?.ref ?? innerRef;

  const { onMouseLeave, onMouseMove, onChartReady, isChartReady, position, colIndex } =
    useBarChartCustomTooltip(chartRef);

  const tooltipRows =
    colIndex !== undefined && data[colIndex]
      ? [
          {
            ...data[colIndex],
            valueText: formatModalBarChartValue(data[colIndex].value, format),
          },
        ]
      : undefined;

  return (
    <div className={classNames("mb-6", "relative", props.className)} {...props}>
      <ModalColumnChartTooltip position={position} rows={tooltipRows} />
      <ExportableChart
        ref={chartRef}
        exportingOptions={{
          title: exportTitle,
          subtitle: exportSubtitle,
          colors: data.map(({ color }) => color),
          chartOptions: {
            xAxis: { lineWidth: 0 },
            plotOptions: {
              column: {
                colorByPoint: false,
              },
            },
          },
        }}
        containerProps={{
          id: chartContainerId,
          onMouseLeave,
          onMouseMove,
          className: classNames("highcharts-no-xaxis", !isChartReady && "cursor-wait"),
        }}
        options={getBarChartOptions({
          nbColumns: data.length,
          colorByPoint: true,
          categories: data.map(({ label, value }) => ({ label, total: value })),
          valueFormat: format,
          noTooltip: true,
          onChartReady,
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
        })}
      />
    </div>
  );
};

export default ModalColumnPointChart;

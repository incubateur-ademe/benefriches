import { SeriesOptionsType } from "highcharts";
import HighchartsReact, { HighchartsReactProps } from "highcharts-react-official";
import { useId, useRef } from "react";
import { sumListWithKey } from "shared";

import { useChartCustomPointColors } from "@/shared/views/charts/useChartCustomColors";
import classNames from "@/shared/views/clsx";
import ExportableChart from "@/shared/views/components/Charts/ExportableChart";

import ModalColumnChartTooltip from "./ModalColumnChartTooltip";
import { getBarChartOptions } from "./modalBarChartOptions";
import { formatModalBarChartValue } from "./modalBarChartValueFormat";
import { useBarChartCustomTooltip } from "./useBarChartCustomTooltip";

type Props = {
  data: {
    label: string;
    values: { label: string; color?: string; value: number }[];
  }[];
  format: "monetary" | "default" | "co2";
  exportTitle: string;
  exportSubtitle?: string;
} & HighchartsReactProps;

const ModalColumnSeriesChart = ({ data, format, exportTitle, exportSubtitle, ...props }: Props) => {
  const id = useId();
  const chartContainerId = `chart-${id}`;

  const chartRef = useRef<HighchartsReact.RefObject>(null);

  useChartCustomPointColors(
    chartContainerId,
    data.map(({ values }) => values.map(({ color }) => color)).flat(),
  );

  const { onMouseLeave, onMouseMove, onChartReady, isChartReady, position, colIndex } =
    useBarChartCustomTooltip(chartRef);

  const tooltipRows =
    colIndex !== undefined
      ? data[colIndex]?.values.map(({ label, color, value }) => ({
          label,
          value: value,
          valueText: formatModalBarChartValue(value, format),
          color,
        }))
      : undefined;

  const series = data
    .map(({ values }, colIndex) =>
      values.map(({ label: detailsLabel, value, color }) => ({
        name: detailsLabel,
        type: "column",
        color,
        data: Array(data.length)
          .fill(null)
          .map((defValue: 0, index) => (colIndex === index ? value : defValue)),
      })),
    )
    .flat();

  return (
    <div className="tw-relative">
      <ModalColumnChartTooltip position={position} rows={tooltipRows} />
      <ExportableChart
        ref={chartRef}
        exportingOptions={{
          title: exportTitle,
          subtitle: exportSubtitle,
          colors: series.map(({ color }) => color),
          chartOptions: { xAxis: { lineWidth: 0 } },
        }}
        containerProps={{
          id: chartContainerId,
          className: classNames("highcharts-no-xaxis", !isChartReady && "tw-cursor-wait"),
          onMouseLeave,
          onMouseMove,
        }}
        options={getBarChartOptions({
          nbColumns: data.length,
          valueFormat: format,
          categories: data.map(({ label, values }) => ({
            label,
            total: sumListWithKey(values, "value"),
          })),
          series: series as Array<SeriesOptionsType>,
          onChartReady,
        })}
        {...props}
      />
    </div>
  );
};

export default ModalColumnSeriesChart;

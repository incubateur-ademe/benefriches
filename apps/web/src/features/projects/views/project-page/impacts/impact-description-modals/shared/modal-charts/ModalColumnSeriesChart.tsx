import * as Highcharts from "highcharts";
import { SeriesOptionsType } from "highcharts";
import HighchartsReact, { HighchartsReactProps } from "highcharts-react-official";
import { useId, useRef } from "react";
import { sumListWithKey } from "shared";

import { useChartCustomPointColors } from "@/shared/views/charts/useChartCustomColors";

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
} & HighchartsReactProps;

const ModalColumnSeriesChart = ({ data, format, ...props }: Props) => {
  const id = useId();
  const chartContainerId = `chart-${id}`;

  const chartRef = useRef<HighchartsReact.RefObject>(null);

  useChartCustomPointColors(
    chartContainerId,
    data.map(({ values }) => values.map(({ color }) => color)).flat(),
  );

  const { onMouseLeave, onMouseMove, position, colIndex } = useBarChartCustomTooltip(chartRef);

  const tooltipRows =
    colIndex !== undefined
      ? data[colIndex]?.values.map(({ label, color, value }) => ({
          label,
          value: value,
          valueText: formatModalBarChartValue(value, format),
          color,
        }))
      : undefined;

  return (
    <div
      className="tw-relative"
      id={chartContainerId}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      <ModalColumnChartTooltip position={position} rows={tooltipRows} />
      <HighchartsReact
        highcharts={Highcharts}
        ref={chartRef}
        containerProps={{ className: "highcharts-no-xaxis" }}
        options={getBarChartOptions({
          nbColumns: data.length,
          valueFormat: format,
          categories: data.map(({ label, values }) => ({
            label,
            total: sumListWithKey(values, "value"),
          })),
          series: data
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
            .flat() as Array<SeriesOptionsType>,
        })}
        {...props}
      />
    </div>
  );
};

export default ModalColumnSeriesChart;

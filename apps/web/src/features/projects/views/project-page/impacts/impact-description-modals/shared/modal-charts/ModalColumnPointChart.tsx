import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { HTMLAttributes, useId, useRef } from "react";

import { useChartCustomPointColors } from "@/shared/views/charts/useChartCustomColors";
import classNames from "@/shared/views/clsx";

import ModalColumnChartTooltip from "./ModalColumnChartTooltip";
import { getBarChartOptions } from "./modalBarChartOptions";
import { formatModalBarChartValue, ValueFormat } from "./modalBarChartValueFormat";
import { useBarChartCustomTooltip } from "./useBarChartCustomTooltip";

type Props = {
  format: ValueFormat;
  data: {
    label: string;
    value: number;
    color?: string;
  }[];
} & HTMLAttributes<HTMLDivElement>;

const ModalColumnPointChart = ({ data, format, ...props }: Props) => {
  const chartContainerId = useId();

  useChartCustomPointColors(
    chartContainerId,
    data.map(({ color }) => color),
  );

  const chartRef = useRef<HighchartsReact.RefObject>(null);

  const { onMouseLeave, onMouseMove, position, colIndex } = useBarChartCustomTooltip(chartRef);

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
    <div
      className={classNames("tw-mb-6", "tw-relative", props.className)}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      {...props}
    >
      <ModalColumnChartTooltip position={position} rows={tooltipRows} />
      <HighchartsReact
        highcharts={Highcharts}
        ref={chartRef}
        containerProps={{ id: chartContainerId, className: "highcharts-no-xaxis" }}
        options={getBarChartOptions({
          nbColumns: data.length,
          colorByPoint: true,
          categories: data.map(({ label, value }) => ({ label, total: value })),
          valueFormat: format,
          noTooltip: true,
          series: [
            {
              type: "column",
              data: data.map(({ value, label }) => ({
                name: label,
                y: value,
              })),
            },
          ],
        })}
      />
    </div>
  );
};

export default ModalColumnPointChart;

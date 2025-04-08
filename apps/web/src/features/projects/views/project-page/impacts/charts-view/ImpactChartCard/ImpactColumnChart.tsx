import { useWindowInnerSize } from "@codegouvfr/react-dsfr/tools/useWindowInnerSize";
import { useBreakpointsValuesPx } from "@codegouvfr/react-dsfr/useBreakpointsValuesPx";
import * as Highcharts from "highcharts";
import { Options, SeriesOptionsType } from "highcharts";
import HighchartsReact, { HighchartsReactProps } from "highcharts-react-official";
import { MouseEvent, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { sumListWithKey } from "shared";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { withDefaultBarChartOptions } from "@/shared/views/charts";

import ImpactChartTooltipContent from "./ImpactChartTooltipContent";

type Props = {
  data: {
    label: string;
    values: { label: string; color?: string; value: number }[];
  }[];
  formatFn?: (value: number) => string;
} & HighchartsReactProps;

type TooltipConfig =
  | {
      left: number;
      top: number;
      width: number;
      columnIndex: number;
    }
  | undefined;

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

  const [tooltipConfig, setTooltipConfig] = useState<TooltipConfig>();

  const tooltipData = tooltipConfig && data[tooltipConfig.columnIndex]?.values;
  const { breakpointsValues } = useBreakpointsValuesPx();
  const { windowInnerWidth } = useWindowInnerSize();

  const isLargeScreen = windowInnerWidth > breakpointsValues.md;

  const nonHoveredColors = useMemo(() => {
    const mainColors = data.map(({ values }) => {
      const mainColorIndex = values.reduce((maxIndex, current, currentIndex, array) => {
        const currentMax = Math.abs(array[maxIndex]?.value ?? 0);
        return Math.abs(current.value) > currentMax ? currentIndex : maxIndex;
      }, 0);

      return values[mainColorIndex]?.color;
    });

    return data.map(({ values }, colIndex) => values.map(() => mainColors[colIndex])).flat();
  }, [data]);

  const hoveredColors = useMemo(() => {
    return data.map(({ values }) => values.map(({ color }) => color)).flat();
  }, [data]);

  const onMouseLeave = useCallback(() => {
    setTooltipConfig(undefined);

    const container = document.getElementById(chartContainerId);
    if (!container) {
      return;
    }
    nonHoveredColors.forEach((color, colorIndex) => {
      const cssIndex = colorIndex > 9 ? colorIndex - 10 : colorIndex;
      const serie = container.querySelector<HTMLElement>(`.highcharts-series-${colorIndex}`);
      if (serie && color) {
        serie.style.setProperty(`--highcharts-color-${cssIndex}`, color);
      }
    });
  }, [chartContainerId, nonHoveredColors]);

  const onMouseEnter = useCallback(() => {
    const container = document.getElementById(chartContainerId);
    if (!container) {
      return;
    }
    hoveredColors.forEach((color, colorIndex) => {
      const cssIndex = colorIndex > 9 ? colorIndex - 10 : colorIndex;
      const serie = container.querySelector<HTMLElement>(`.highcharts-series-${colorIndex}`);
      if (serie && color) {
        serie.style.setProperty(`--highcharts-color-${cssIndex}`, color);
      }
    });
  }, [chartContainerId, hoveredColors]);

  const onMouseMove = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (!isLargeScreen) {
        return undefined;
      }

      const data = chartRef.current?.chart.series[0]?.data ?? [];
      const chart = chartRef.current?.chart;

      if (!chart) {
        return;
      }

      const pointHovered = event.clientX - chart.container.getBoundingClientRect().left;

      setTooltipConfig(
        data
          .map((point) => {
            if (!point.shapeArgs) {
              return undefined;
            }
            const { x, width } = point.shapeArgs as { x: number; width: number };

            const left = x + chart.plotLeft;
            const right = left + width;
            const tooltipWidth = width * 3;
            if (pointHovered < right && pointHovered > left) {
              return {
                left: left - width,
                top: chart.plotTop,
                width: tooltipWidth,
                columnIndex: point.index,
              };
            }
            return undefined;
          })
          .find((elem) => elem),
      );
    },
    [isLargeScreen],
  );

  useEffect(() => {
    const container = document.getElementById(chartContainerId);
    if (!container) {
      return;
    }
    nonHoveredColors.forEach((color, colorIndex) => {
      const cssIndex = colorIndex > 9 ? colorIndex - 10 : colorIndex;
      const serie = container.querySelector<HTMLElement>(`.highcharts-series-${colorIndex}`);
      if (serie && color) {
        serie.style.setProperty(`--highcharts-color-${cssIndex}`, color);
      }
    });
  }, [chartContainerId, nonHoveredColors]);

  return (
    <div
      className="tw-relative highcharts-same-color-before-hover"
      id={chartContainerId}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
    >
      {tooltipData && (
        <span
          role="tooltip"
          className="dsfr-tooltip-without-placement tw-absolute"
          style={{ left: tooltipConfig.left, top: -80, width: tooltipConfig.width }}
        >
          <ImpactChartTooltipContent
            rows={tooltipData.map(({ label, color, value }) => ({
              label,
              value: value,
              valueText: formatFn(value),
              color,
            }))}
          />
        </span>
      )}
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
                  return `<strong>${this.value}</strong><br>${formatFn(sumListWithKey(data[this.pos]?.values ?? [], "value"))}`;
                },
              },
            },
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
          } as Highcharts.Options
        }
        {...props}
      />
    </div>
  );
};

export default ImpactColumnChart;

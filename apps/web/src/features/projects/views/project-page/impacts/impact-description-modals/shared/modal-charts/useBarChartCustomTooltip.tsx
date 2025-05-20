import HighchartsReact from "highcharts-react-official";
import { MouseEvent, useCallback, useState } from "react";

type TooltipConfig =
  | {
      left: number;
      top: number;
      width: number;
      columnIndex: number;
      adjustArrowX: number;
    }
  | undefined;

const TOOLTIP_SIDE_WIDTH = 100;

export const useBarChartCustomTooltip = (
  chartRef: React.RefObject<HighchartsReact.RefObject | null>,
) => {
  const [config, setConfig] = useState<TooltipConfig>();
  const [isChartReady, setIsChartReady] = useState(false);

  const onChartReady = () => {
    setIsChartReady(true);
  };

  const onMouseLeave = useCallback(() => {
    setConfig(undefined);
  }, []);

  const onMouseMove = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const data = chartRef.current?.chart.series[0]?.data ?? [];
      const chart = chartRef.current?.chart;

      if (!chart) {
        return;
      }

      const pointHovered = event.clientX - chart.container.getBoundingClientRect().left;

      setConfig(
        data
          .map((point) => {
            if (!point.shapeArgs) {
              return undefined;
            }
            const { x, width } = point.shapeArgs as { x: number; width: number };
            const left = x + chart.plotLeft;
            const right = left + width;
            const tooltipWidth = width + TOOLTIP_SIDE_WIDTH * 2;
            if (pointHovered < right && pointHovered > left) {
              return {
                left: left - (point.index !== 0 ? TOOLTIP_SIDE_WIDTH : TOOLTIP_SIDE_WIDTH / 2),
                adjustArrowX: point.index !== 0 ? 0 : TOOLTIP_SIDE_WIDTH / 2,
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
    [chartRef],
  );

  return {
    position: config
      ? {
          left: config.left,
          adjustArrowX: config.adjustArrowX,
          top: config.top,
          width: config.width,
        }
      : undefined,
    colIndex: config?.columnIndex,
    onMouseMove: isChartReady ? onMouseMove : undefined,
    onMouseLeave: isChartReady ? onMouseLeave : undefined,
    onChartReady,
    isChartReady,
  };
};

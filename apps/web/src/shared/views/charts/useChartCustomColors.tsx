import { useEffect } from "react";

export const useChartCustomSerieColors = (containerId: string, colors: (string | undefined)[]) => {
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) {
      return;
    }
    colors.forEach((color, colorIndex) => {
      if (!color) {
        return;
      }
      // Highchart ne gère que 9 couleurs différentes (les classes vont de .highcharts-color-0 à .highcharts-color-9)
      const hcColorIndex = colorIndex % 10;
      const nthChild = Math.floor(colorIndex / 10);

      const series = container.querySelectorAll<HTMLElement>(`.highcharts-series-${colorIndex}`);
      const serie = series[nthChild];
      if (serie) {
        serie.style.setProperty(`--highcharts-color-${hcColorIndex}`, color);
      }

      const legendItems = container.querySelectorAll<HTMLElement>(
        `.highcharts-legend-item.highcharts-color-${hcColorIndex}`,
      );
      const legendItem = legendItems[nthChild];
      if (legendItem) {
        legendItem.style.setProperty(`--highcharts-color-${hcColorIndex}`, color);
      }
    });
  }, [colors, containerId]);
};

export const useChartCustomPointColors = (containerId: string, colors: (string | undefined)[]) => {
  useEffect(() => {
    const container = document.getElementById(containerId);

    if (!container) {
      return;
    }
    colors.forEach((color, colorIndex) => {
      if (!color) {
        return;
      }

      // Highchart ne gère que 9 couleurs différentes (les classes vont de .highcharts-color-0 à .highcharts-color-9)
      const hcColorIndex = colorIndex % 10;
      const nthChild = Math.floor(colorIndex / 10);

      const points = container.querySelectorAll<HTMLElement>(
        `.highcharts-point.highcharts-color-${hcColorIndex}`,
      );
      const point = points[nthChild];
      const dataLabelConnectors = container.querySelectorAll<HTMLElement>(
        `.highcharts-data-label-connector.highcharts-color-${hcColorIndex}`,
      );
      const dataLabelConnector = dataLabelConnectors[nthChild];

      const legendItems = container.querySelectorAll<HTMLElement>(
        `.highcharts-legend-item.highcharts-color-${hcColorIndex}`,
      );
      const legendItem = legendItems[nthChild];

      if (point) {
        point.style.setProperty(`--highcharts-color-${hcColorIndex}`, color);
      }
      if (dataLabelConnector) {
        dataLabelConnector.style.setProperty(`--highcharts-color-${hcColorIndex}`, color);
      }

      if (legendItem) {
        legendItem.style.setProperty(`--highcharts-color-${hcColorIndex}`, color);
      }
    });
  }, [colors, containerId]);
};

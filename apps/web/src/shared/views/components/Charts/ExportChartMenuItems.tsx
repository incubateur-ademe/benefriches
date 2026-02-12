import { MenuSection } from "@headlessui/react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import MenuItemButton from "../Menu/MenuItemButton";

type Props = {
  chartRef: React.RefObject<HighchartsReact.RefObject | null>;
  colors?: (string | undefined)[];
  colorBySeries?: boolean;
  exportConfig: Highcharts.ExportingOptions;
};

const downloadAsJpeg = ({ chartRef, exportConfig, colors, colorBySeries }: Props) => {
  if (!chartRef.current) {
    return;
  }

  const parser = new DOMParser();
  const svgChart = parser.parseFromString(
    chartRef.current.chart.getSVG(exportConfig.chartOptions),
    "image/svg+xml",
  );

  /** Handle custom colors **/
  if (colorBySeries) {
    colors?.forEach((color, colorIndex) => {
      if (!color) {
        return;
      }
      const area = svgChart.querySelector<HTMLElement>(
        `.highcharts-series.highcharts-series-${colorIndex}.highcharts-color-${colorIndex} .highcharts-area`,
      );
      if (!area) {
        return;
      }
      area.style.setProperty(`stroke`, color);
      area.style.setProperty(`fill`, color);
    });
  } else {
    svgChart.querySelectorAll<HTMLElement>(`.highcharts-point`).forEach((elem, elemIndex) => {
      elem.style.setProperty(`stroke`, "#ffffff");
      if (!colors?.[elemIndex]) {
        return;
      }
      elem.style.setProperty(`fill`, colors[elemIndex]);
    });

    svgChart
      .querySelectorAll<HTMLElement>(`.highcharts-data-label-connector`)
      .forEach((elem, elemIndex) => {
        if (!colors?.[elemIndex]) {
          return;
        }
        elem.style.setProperty(`stroke`, colors[elemIndex]);
      });
  }

  /** Handle custom colors **/

  Highcharts.downloadSVGLocal(
    svgChart.documentElement.outerHTML,
    {
      type: "image/jpeg",
      ...exportConfig,
    },
    () => {}, // error
    () => {}, // success
  );
};

const ExportChartMenuItems = ({ chartRef, exportConfig, colors, colorBySeries = false }: Props) => {
  return (
    <MenuSection>
      <MenuItemButton
        iconId="ri-image-line"
        onClick={(event) => {
          event.stopPropagation();
          // Méthode custom pour avoir les bonnes couleurs dans l'image exportée
          // (la méthode exportLocalChart d'highchart n'aura pas accès au css)
          // Passer les couleurs dans les paramètres (series.data) limite le nombre de couleurs à 9
          downloadAsJpeg({ chartRef, exportConfig, colors, colorBySeries });
        }}
      >
        Télécharger au format JPEG
      </MenuItemButton>

      <MenuItemButton
        iconId="ri-table-line"
        onClick={(event) => {
          event.stopPropagation();
          chartRef.current?.chart.downloadXLS();
        }}
      >
        Télécharger au format XLS
      </MenuItemButton>
      <MenuItemButton
        iconId="ri-table-line"
        onClick={(event) => {
          event.stopPropagation();
          chartRef.current?.chart.downloadCSV();
        }}
      >
        Télécharger au format CSV
      </MenuItemButton>
    </MenuSection>
  );
};

export default ExportChartMenuItems;

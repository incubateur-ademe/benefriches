import { MenuSection } from "@headlessui/react";
import * as Highcharts from "highcharts";
import type { HighchartsReact } from "highcharts-react-official";

import MenuItemButton from "../Menu/MenuItemButton";
import { buildChartSvg } from "./buildChartSvgFromRef";

type Props = {
  chartRef: React.RefObject<HighchartsReact.RefObject | null>;
  colors?: (string | undefined)[];
  colorBySeries?: boolean;
  exportConfig: Highcharts.ExportingOptions;
};

const downloadAsJpeg = async ({ chartRef, exportConfig, colors, colorBySeries }: Props) => {
  if (!chartRef.current) {
    return;
  }

  const svgChart = await buildChartSvg({ chartRef, exportConfig, colors, colorBySeries });

  if (!svgChart) return;

  Highcharts.downloadSVGLocal(svgChart, {
    type: "image/jpeg",
    ...exportConfig,
  });
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
          void downloadAsJpeg({ chartRef, exportConfig, colors, colorBySeries });
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

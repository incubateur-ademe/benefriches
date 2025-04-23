import Button from "@codegouvfr/react-dsfr/Button";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import * as Highcharts from "highcharts";
import HighchartsReact, { HighchartsReactProps } from "highcharts-react-official";
import { Fragment, useRef } from "react";

import classNames from "@/shared/views/clsx";

import { withDefaultChartOptions } from "../../charts";

type Props = {
  ref?: React.RefObject<HighchartsReact.RefObject | null>;
  exportingOptions: {
    title: string;
    subtitle?: string;
    caption?: string;
    colors?: string[];
    csvColumnHeader?: {
      y: string;
      z?: string;
    };
    chartOptions?: Highcharts.Options;
  };
} & HighchartsReactProps;

const defaultExportConfig = withDefaultChartOptions({}).exporting;

const ExportableChart = ({ ref, exportingOptions, options, ...props }: Props) => {
  const innerRef = useRef<HighchartsReact.RefObject>(null);
  const chartRef = ref === undefined ? innerRef : ref;

  const filename = exportingOptions.subtitle
    ? `${exportingOptions.title} - ${exportingOptions.subtitle}`
    : exportingOptions.title;

  const exportConfig: Highcharts.ExportingOptions = {
    ...defaultExportConfig,
    fallbackToExportServer: false,
    filename,
    tableCaption: filename,
    csv: {
      columnHeaderFormatter: function (series: Highcharts.Series | undefined, key?: "y" | "z") {
        if (exportingOptions.csvColumnHeader && key) {
          return exportingOptions.csvColumnHeader[key] ?? series?.name ?? key;
        }
        return series?.name ?? key ?? "";
      },
    },
    chartOptions: {
      ...defaultExportConfig?.chartOptions,
      title: { text: exportingOptions.title },
      subtitle: { text: exportingOptions.subtitle },
      caption: { text: exportingOptions.caption },
      ...exportingOptions.chartOptions,
    },
  };

  return (
    <div className="tw-relative">
      <Menu>
        <MenuButton as={Fragment}>
          <Button
            title="Menu"
            priority="tertiary no outline"
            iconId="ri-download-2-line"
            onClick={(event) => {
              event.stopPropagation();
            }}
            className="tw-absolute tw-right-2 -tw-top-2 tw-z-10 tw-text-text-light"
          />
        </MenuButton>
        <MenuItems
          anchor="bottom end"
          transition
          className={classNames(
            "tw-absolute",
            "tw-right-0",
            "tw-z-[2000]", // pour s'afficher correctement dans une Dialog (z-index 1750)
            "tw-w-72",
            "tw-mt-2",
            "tw-rounded-md",
            "tw-bg-white dark:!tw-bg-dsfr-contrastGrey",
            "tw-shadow-lg",
            "tw-ring-1 tw-ring-black/5",
            "tw-py-1",
          )}
        >
          <MenuItem>
            <Button
              size="small"
              className="tw-w-full tw-py-2"
              priority="tertiary no outline"
              // Méthode custom pour avoir les bonnes couleurs dans l'image exportée
              // (la méthode exportLocalChart d'highchart n'aura pas accès au css)
              // Passer les couleurs dans les paramètres (series.data) limite le nombre de couleurs à 9
              onClick={(event) => {
                event.stopPropagation();
                if (!chartRef.current) {
                  return;
                }

                const parser = new DOMParser();
                const svgChart = parser.parseFromString(
                  chartRef.current.chart.getSVG(exportConfig.chartOptions),
                  "image/svg+xml",
                );

                svgChart
                  .querySelectorAll<HTMLElement>(`.highcharts-point`)
                  .forEach((elem, elemIndex) => {
                    if (!exportingOptions.colors || !exportingOptions.colors[elemIndex]) {
                      return;
                    }
                    elem.style.setProperty(`fill`, exportingOptions.colors[elemIndex]);
                    elem.style.setProperty(`stroke`, "#ffffff");
                  });

                svgChart
                  .querySelectorAll<HTMLElement>(`.highcharts-data-label-connector`)
                  .forEach((elem, elemIndex) => {
                    if (!exportingOptions.colors || !exportingOptions.colors[elemIndex]) {
                      return;
                    }
                    elem.style.setProperty(`stroke`, exportingOptions.colors[elemIndex]);
                  });

                Highcharts.downloadSVGLocal(
                  svgChart.documentElement.outerHTML,
                  exportConfig,
                  () => {}, // error
                  () => {}, // success
                );
              }}
            >
              Télécharger au format PNG
            </Button>
          </MenuItem>

          <MenuItem>
            <Button
              size="small"
              className="tw-w-full tw-py-2"
              priority="tertiary no outline"
              onClick={(event) => {
                event.stopPropagation();
                chartRef.current?.chart.downloadXLS();
              }}
            >
              Télécharger au format XLS
            </Button>
          </MenuItem>
          <MenuItem>
            <Button
              size="small"
              className="tw-w-full tw-py-2"
              priority="tertiary no outline"
              onClick={(event) => {
                event.stopPropagation();
                chartRef.current?.chart.downloadCSV();
              }}
            >
              Télécharger au format CSV
            </Button>
          </MenuItem>
        </MenuItems>
        <HighchartsReact
          highcharts={Highcharts}
          ref={chartRef}
          options={{ ...options, exporting: exportConfig }}
          {...props}
        />
      </Menu>
    </div>
  );
};

export default ExportableChart;

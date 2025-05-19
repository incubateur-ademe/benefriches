import { withDefaultChartOptions } from ".";

export type ExportingOptionsProps = {
  title?: string;
  subtitle?: string;
  caption?: string;
  colors?: (string | undefined)[];
  colorBySeries?: boolean;
  csvColumnHeader?: {
    y: string;
    z?: string;
  };
  chartOptions?: Highcharts.Options;
};

const defaultExportConfig = withDefaultChartOptions({}).exporting;

const useExportConfig = (exportingOptions: ExportingOptionsProps): Highcharts.ExportingOptions => {
  const filename = exportingOptions.subtitle
    ? `${exportingOptions.title} - ${exportingOptions.subtitle}`
    : exportingOptions.title;

  return {
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
};

export default useExportConfig;

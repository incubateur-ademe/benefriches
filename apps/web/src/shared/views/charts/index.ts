import "highcharts";
import { Options } from "highcharts/highcharts";
// import modules here so it's loaded once for every chart
import "highcharts/modules/accessibility";
import "highcharts/modules/data";
import "highcharts/modules/export-data";
import "highcharts/modules/exporting";
import "highcharts/modules/no-data-to-display";
import "highcharts/modules/offline-exporting";

export function withDefaultChartOptions(options: Options): Options {
  return {
    accessibility: { enabled: true },
    credits: { enabled: false },
    title: { text: "" },
    lang: {
      exportData: {
        categoryHeader: "",
      },
      noData: "Aucune donnée disponible",
    },
    exporting: {
      fallbackToExportServer: false,
      buttons: {
        contextButton: {
          enabled: false,
        },
      },
      chartOptions: {
        chart: {
          styledMode: false,
          height: undefined,
          style: {
            backgroundColor: "#FFFFFF",
            fontFamily: "'Marianne', Arial, sans-serif",
          },
          spacingBottom: 10,
          spacingLeft: 10,
          spacingRight: 10,
          spacingTop: 10,
        },
      },
    },
    ...options,
  };
}

export function withDefaultBarChartOptions({
  plotOptions = {},
  chart = {},
  ...options
}: Options): Options {
  return withDefaultChartOptions({
    chart: {
      type: "column",
      height: 275,
      styledMode: true,
      ...chart,
    },
    yAxis: {
      labels: {
        enabled: false,
      },
      startOnTick: false,
      endOnTick: false,
      tickAmount: 1,
      tickPositions: [0],
      title: {
        text: null,
      },
      maxPadding: 0.1,
    },
    plotOptions: {
      ...plotOptions,
      column: { borderRadius: 8, minPointLength: 4, ...(plotOptions.column ?? {}) },
    },
    ...options,
  });
}

export function withDefaultAreaChartOptions({ chart = {}, ...options }: Options): Options {
  return withDefaultChartOptions({
    chart: {
      type: "area",
      height: 200,
      marginLeft: 0,
      marginRight: 0,
      styledMode: true,
      spacingBottom: 0,
      spacingLeft: 0,
      spacingRight: 0,
      spacingTop: 0,
      ...chart,
    },
    yAxis: {
      visible: false,
      tickLength: 0,
      maxPadding: 0,
    },
    tooltip: {
      enabled: false,
    },
    plotOptions: {
      area: {
        stacking: "normal",
        marker: { enabled: false, states: { hover: { enabled: false } } },
        lineWidth: 0,
      },
      series: {
        enableMouseTracking: false,
      },
    },
    legend: { enabled: false },
    ...options,
  });
}

export function withDefaultPieChartOptions({
  plotOptions = {},
  chart = {},
  legend = {},
  ...options
}: Options): Options {
  return withDefaultChartOptions({
    chart: {
      styledMode: true,
      height: "300px",
      type: "pie",
      spacingLeft: 0,
      spacingTop: 0,
      spacingBottom: 0,
      spacingRight: 0,
      ...chart,
    },
    plotOptions: {
      series: {
        states: {
          hover: {
            halo: null,
          },
        },
      },
      ...plotOptions,
    },
    legend: {
      align: "right",
      verticalAlign: "middle",
      layout: "vertical",
      symbolWidth: 16,
      symbolHeight: 16,
      symbolRadius: 4,
      symbolPadding: 8,
      useHTML: true,
      events: {
        itemClick: function () {
          return false;
        },
      },
      ...legend,
    },
    ...options,
  });
}

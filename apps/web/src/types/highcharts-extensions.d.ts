import * as Highcharts from "highcharts";

declare module "highcharts" {
  interface Chart {
    downloadCSV(): void;
    downloadXLS(): void;
    getSVG(chartOptions?: Highcharts.Options): string;
  }
}

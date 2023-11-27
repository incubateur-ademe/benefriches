import { Options } from "highcharts";

export const sharedChartConfig: Options = {
  chart: {
    type: "column",
    height: "200px",
  },
  title: {
    text: "",
  },
  yAxis: {
    title: { text: "" },
  },
  credits: { enabled: false },
} as const;

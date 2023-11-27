import { Options } from "highcharts";

export const sharedChartConfig: Partial<Options> = {
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
};

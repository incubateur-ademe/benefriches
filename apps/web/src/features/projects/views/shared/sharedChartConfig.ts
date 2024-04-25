export const baseColumnChartConfig: Highcharts.Options = {
  chart: {
    type: "column",
    height: "275px",
    styledMode: true,
  },
  title: {
    text: "",
  },
  yAxis: {
    title: { text: "" },
  },
  credits: { enabled: false },
} as const;

export const baseAreaChartConfig: Highcharts.Options = {
  chart: {
    type: "area",
    height: "180px",
    marginLeft: 0,
    marginRight: 0,
    styledMode: true,
  },
  title: {
    text: "",
  },
  yAxis: {
    visible: false,
    tickLength: 0,
  },
  credits: { enabled: false },
} as const;

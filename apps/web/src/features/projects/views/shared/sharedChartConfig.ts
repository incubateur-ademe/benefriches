export const baseColumnChartConfig = {
  chart: {
    type: "column",
    height: "240px",
    style: {
      fontFamily: "Marianne",
    },
    background: "#ECF5FD",
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
    height: "240px",
    style: {
      fontFamily: "Marianne",
    },
    backgroundColor: "#ECF5FD",
  },
  title: {
    text: "",
  },
  yAxis: {
    title: { text: "" },
  },
  credits: { enabled: false },
} as const;

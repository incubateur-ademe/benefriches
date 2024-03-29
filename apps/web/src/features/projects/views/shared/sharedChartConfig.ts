export const baseColumnChartConfig: Highcharts.Options = {
  chart: {
    type: "column",
    height: "275px",
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

export const baseAreaChartConfig: Highcharts.Options = {
  chart: {
    type: "area",
    height: "100%",
    marginLeft: 0,
    marginRight: 0,
    style: {
      fontFamily: "Marianne",
    },
    backgroundColor: "#ECF5FD",
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

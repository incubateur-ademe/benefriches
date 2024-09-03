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
    maxPadding: 0,
  },
  credits: { enabled: false },
  plotOptions: {
    area: {
      marker: {
        enabled: false,
      },
      lineWidth: 0,
    },
  },
} as const;

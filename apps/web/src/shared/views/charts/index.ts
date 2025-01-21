import { type Options } from "highcharts";
// import accessiblity module here so it's loaded once for every chart
import "highcharts/modules/accessibility";

export function withDefaultChartOptions(options: Options): Options {
  return {
    accessibility: { enabled: true },
    credits: { enabled: false },
    title: { text: "" },
    ...options,
  };
}

export function withDefaultBarChartOptions(options: Options): Options {
  return {
    ...withDefaultChartOptions(options),
    chart: {
      type: "column",
      height: "275px",
      styledMode: true,
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
  };
}

export function withDefaultAreaChartOptions(options: Options): Options {
  return {
    ...withDefaultChartOptions(options),
    chart: {
      type: "area",
      height: "220px",
      marginLeft: 0,
      marginRight: 0,
      styledMode: true,
    },
    yAxis: {
      visible: false,
      tickLength: 0,
      maxPadding: 0,
    },
    ...options,
  };
}

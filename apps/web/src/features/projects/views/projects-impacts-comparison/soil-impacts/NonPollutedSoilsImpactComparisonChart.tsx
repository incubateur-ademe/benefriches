import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { sharedChartConfig } from "../sharedChartConfig";

function NonPollutedSoilsImpactComparisonChart() {
  const barChartOptions: Highcharts.Options = {
    ...sharedChartConfig,
    xAxis: {
      categories: [""],
      crosshair: false,
    },
    tooltip: {
      valueSuffix: " m2",
    },
    plotOptions: {
      column: {
        pointPadding: 0.05,
        borderWidth: 0,
        dataLabels: { enabled: true, format: "{point.y} m2" },
      },
    },
    series: [
      {
        type: "column",
        name: "Pas de projet",
        data: [120000],
      },
      {
        type: "column",
        name: "Centrale photovoltaïque",
        data: [150000],
      },
    ],
  };

  return (
    <div>
      <p>
        <strong>✨ Surface non polluée</strong>
      </p>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default NonPollutedSoilsImpactComparisonChart;

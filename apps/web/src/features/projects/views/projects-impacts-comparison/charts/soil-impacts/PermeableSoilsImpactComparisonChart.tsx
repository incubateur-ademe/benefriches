import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { sharedChartConfig } from "../../../shared/sharedChartConfig";

function PermeableSoilsImpactComparisonChart() {
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
        data: [97500],
      },
      {
        type: "column",
        name: "Centrale photovoltaïque",
        data: [146250],
      },
    ],
  };

  return (
    <div>
      <p>
        <strong>🌧 Surface perméable</strong>
      </p>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default PermeableSoilsImpactComparisonChart;

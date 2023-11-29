import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { sharedChartConfig } from "../../../shared/sharedChartConfig";

function PollinationFinancialImpactComparisonChart() {
  const barChartOptions: Highcharts.Options = {
    ...sharedChartConfig,
    xAxis: {
      categories: [""],
    },
    tooltip: {
      valueSuffix: " €",
    },
    plotOptions: {
      column: {
        pointPadding: 0.05,
        borderWidth: 0,
        dataLabels: { enabled: true, format: "{point.y} €" },
      },
    },
    series: [
      {
        type: "column",
        name: "Pas de projet",
        data: [5706],
      },
      {
        type: "column",
        name: "Centrale photovoltaïque",
        data: [5100],
      },
    ],
  };

  return (
    <div>
      <p>
        <strong>🐝 Pollinisation</strong>
      </p>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default PollinationFinancialImpactComparisonChart;

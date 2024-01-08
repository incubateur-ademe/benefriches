import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { sharedChartConfig } from "../../../shared/sharedChartConfig";

function EnvironmentImpactComparisonChart() {
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
        dataLabels: { enabled: true, format: "{point.y:,.0f} €" },
      },
    },
    series: [
      {
        type: "column",
        name: "Pas de changement",
        data: [8170],
      },
      {
        type: "column",
        name: "Centrale photovoltaïque",
        data: [6086],
      },
    ],
  };

  return (
    <div>
      <p>
        <strong>🚵 Aménité environnementale</strong>
      </p>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default EnvironmentImpactComparisonChart;

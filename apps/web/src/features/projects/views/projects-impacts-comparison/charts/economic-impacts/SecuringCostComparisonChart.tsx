import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { sharedChartConfig } from "../sharedChartConfig";

function SecuringCostComparisonChart() {
  const barChartOptions: Highcharts.Options = {
    ...sharedChartConfig,
    xAxis: {
      categories: ["pour Terre Cuite d'Occitanie"],
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
        data: [-3890401],
      },
      {
        type: "column",
        name: "Centrale photovoltaïque",
        data: [0],
      },
    ],
  };

  return (
    <div>
      <p>
        <strong>Sécurisation de la friche</strong>
      </p>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default SecuringCostComparisonChart;

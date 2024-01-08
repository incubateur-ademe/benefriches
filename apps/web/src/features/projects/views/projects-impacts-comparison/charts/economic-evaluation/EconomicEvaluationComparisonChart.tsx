import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { sharedChartConfig } from "../../../shared/sharedChartConfig";

function EconomicEvaluationComparisonChart() {
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
        dataLabels: {
          enabled: true,
          format: "{point.y:,.0f} €",
        },
      },
    },
    series: [
      {
        type: "column",
        name: "Terre Cuite d'Occitanie",
        data: [-3911792],
      },
      {
        type: "column",
        name: "Générale du Solaire",
        data: [-9794959],
      },
    ],
  };

  return (
    <div>
      <p>
        <strong>💰 Bilan économique</strong>
      </p>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default EconomicEvaluationComparisonChart;

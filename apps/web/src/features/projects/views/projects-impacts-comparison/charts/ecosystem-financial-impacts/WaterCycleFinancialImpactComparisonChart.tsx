import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { sharedChartConfig } from "../../../shared/sharedChartConfig";

function WaterCycleFinancialImpactComparison() {
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
        name: "Pas de changement",
        data: [90994],
      },
      {
        type: "column",
        name: "Centrale photovoltaïque",
        data: [91503],
      },
    ],
  };

  return (
    <div>
      <p>
        <strong>💧 Cycle de l'eau</strong>
      </p>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default WaterCycleFinancialImpactComparison;

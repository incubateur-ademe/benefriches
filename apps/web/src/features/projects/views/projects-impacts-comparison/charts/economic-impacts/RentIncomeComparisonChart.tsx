import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { baseColumnChartConfig } from "../../../shared/sharedChartConfig";

function RentIncomeComparisonChart() {
  const barChartOptions: Highcharts.Options = {
    ...baseColumnChartConfig,
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
        name: "Pas changement",
        data: [21391],
      },
      {
        type: "column",
        name: "Centrale photovoltaïque",
        data: [381974],
      },
    ],
  };

  return (
    <div>
      <p>
        <strong>Revenu locatif</strong>
      </p>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default RentIncomeComparisonChart;

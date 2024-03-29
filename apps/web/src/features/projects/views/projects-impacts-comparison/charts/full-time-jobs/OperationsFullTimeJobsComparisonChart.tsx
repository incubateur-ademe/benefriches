import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { baseColumnChartConfig } from "../../../shared/sharedChartConfig";

function OperationsFullTimeJobsComparisonChart() {
  const barChartOptions: Highcharts.Options = {
    ...baseColumnChartConfig,
    xAxis: {
      categories: [""],
    },
    tooltip: {
      valueSuffix: " équivalents temps-plein",
    },
    plotOptions: {
      column: {
        pointPadding: 0.05,
        borderWidth: 0,
        dataLabels: { enabled: true, format: "{point.y:,.1f} ETP" },
      },
    },
    series: [
      {
        type: "column",
        name: "Pas de changement",
        data: [0.1],
      },
      {
        type: "column",
        name: "Centrale photovoltaïque",
        data: [0.3],
      },
    ],
  };

  return (
    <div>
      <p>
        <strong>🧑‍🔧 Emplois liés à l'exploitation du site</strong>
      </p>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default OperationsFullTimeJobsComparisonChart;

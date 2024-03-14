import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { baseColumnChartConfig } from "../../../shared/sharedChartConfig";

function FullTimeJobsComparisonChart() {
  const barChartOptions: Highcharts.Options = {
    ...baseColumnChartConfig,
    xAxis: {
      categories: [""],
      crosshair: false,
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
        data: [1.5],
      },
    ],
  };

  return (
    <div>
      <p>
        <strong>💼 Emploi</strong>
      </p>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default FullTimeJobsComparisonChart;

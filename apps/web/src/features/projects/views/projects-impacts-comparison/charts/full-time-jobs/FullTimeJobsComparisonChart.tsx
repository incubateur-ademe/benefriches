import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { sharedChartConfig } from "../../../shared/sharedChartConfig";

function FullTimeJobsComparisonChart() {
  const barChartOptions: Highcharts.Options = {
    ...sharedChartConfig,
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
        dataLabels: { enabled: true, format: "{point.y} ETP" },
      },
    },
    series: [
      {
        type: "column",
        name: "Pas de projet",
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

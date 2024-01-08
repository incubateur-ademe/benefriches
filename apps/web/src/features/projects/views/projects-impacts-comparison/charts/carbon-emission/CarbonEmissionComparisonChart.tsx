import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { sharedChartConfig } from "../../../shared/sharedChartConfig";

function CarbonEmissionComparisonChart() {
  const barChartOptions: Highcharts.Options = {
    ...sharedChartConfig,
    xAxis: {
      categories: [""],
      crosshair: false,
    },
    tooltip: {
      valueSuffix: " tonnes évitées",
    },
    plotOptions: {
      column: {
        pointPadding: 0.05,
        borderWidth: 0,
        dataLabels: { enabled: true, format: "{point.y:,.0f} t évitées" },
      },
    },
    series: [
      {
        type: "column",
        name: "Pas de changement",
        data: [-3780],
      },
      {
        type: "column",
        name: "Centrale photovoltaïque",
        data: [-7732],
      },
    ],
  };

  return (
    <div>
      <p>
        <strong>☁️ Émissions de CO2-eq</strong>
      </p>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default CarbonEmissionComparisonChart;

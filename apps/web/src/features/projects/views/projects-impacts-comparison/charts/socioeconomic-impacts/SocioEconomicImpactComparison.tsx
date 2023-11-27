import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { sharedChartConfig } from "../sharedChartConfig";

function SocioEconomicImpactComparisonChart() {
  const barChartOptions: Highcharts.Options = {
    ...sharedChartConfig,
    xAxis: {
      categories: [""],
      crosshair: false,
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
        data: [-3342983],
      },
      {
        type: "column",
        name: "Centrale photovoltaïque",
        data: [-1734590],
      },
    ],
  };

  return (
    <div>
      <p>
        <strong>🌍 Impacts socio-économiques</strong>
      </p>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default SocioEconomicImpactComparisonChart;

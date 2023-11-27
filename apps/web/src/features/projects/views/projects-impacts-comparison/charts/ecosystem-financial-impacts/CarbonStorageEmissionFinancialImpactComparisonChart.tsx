import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { sharedChartConfig } from "../sharedChartConfig";

function CarbonStorageEmissionFinancialImpactComparisonChart() {
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
        name: "Pas de projet",
        data: [511890],
      },
      {
        type: "column",
        name: "Centrale photovoltaïque",
        data: [589230],
      },
    ],
  };

  return (
    <div>
      <p>
        <strong>
          🍂 Émissions de CO2-eq évitées grâce au stockage du carbone
        </strong>
      </p>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default CarbonStorageEmissionFinancialImpactComparisonChart;

import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { sharedChartConfig } from "../../../shared/sharedChartConfig";

function SocioEconomicBenefitsComparisonChart() {
  const barChartOptions: Highcharts.Options = {
    ...sharedChartConfig,
    xAxis: {
      categories: ["Entreprises", "Collectivité", "Société"],
      crosshair: false,
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
        name: "Pas de changement",
        data: [-3869011, -9471, 589994],
      },
      {
        type: "column",
        name: "Centrale photovoltaïque",
        data: [98550, 717007, 1328000],
      },
    ],
  };

  return (
    <div>
      <p>
        <strong>Bénéficiaires des impacts socio-économiques</strong>
      </p>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default SocioEconomicBenefitsComparisonChart;

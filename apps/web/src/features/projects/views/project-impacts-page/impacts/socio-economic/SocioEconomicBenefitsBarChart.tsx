import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { sharedChartConfig } from "../../../shared/sharedChartConfig";

function SocioEconomicBenefitsBarChart() {
  const barChartOptions: Highcharts.Options = {
    ...sharedChartConfig,
    chart: {
      ...sharedChartConfig.chart,
      type: "area",
      height: "400",
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      categories: ["Entreprises", "Collectivité", "Société humaine"],
    },
    yAxis: {
      title: { text: "" },
    },
    tooltip: {
      valueSuffix: " €",
    },
    plotOptions: {
      column: {
        pointPadding: 0.1,
        borderWidth: 0,
        dataLabels: { enabled: true, format: "{point.y} €" },
      },
    },
    series: [
      {
        name: "Montant en €",
        type: "column",
        data: [3967561, 726478, 743074],
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

export default SocioEconomicBenefitsBarChart;

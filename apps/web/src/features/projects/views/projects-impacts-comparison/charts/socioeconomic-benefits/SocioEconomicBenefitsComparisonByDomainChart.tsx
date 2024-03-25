import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { baseColumnChartConfig } from "../../../shared/sharedChartConfig";

function SocioEconomicBenefitsComparisonByDomainChart() {
  const barChartOptions: Highcharts.Options = {
    ...baseColumnChartConfig,
    chart: {
      ...baseColumnChartConfig.chart,
      height: "400",
    },
    xAxis: {
      categories: [
        "Sols",
        "Forêt",
        "Énergie",
        "Eau",
        "Biodiversité",
        "Social et bien-être",
        "Construction et entretien",
        "Immobilier",
        "Service public",
      ],
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
        data: [532168, 2438, 0, 81523, 81523, -43530, -3890401, 21391, 0],
      },
      {
        type: "column",
        name: "Centrale photovoltaïque",
        data: [607698, 1395, 1114542, 91503, 6985, 6086, 0, 381974, 433583],
      },
    ],
  };

  return (
    <div>
      <p>
        <strong>Domaines concernés par les impacts socio-économiques</strong>
      </p>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default SocioEconomicBenefitsComparisonByDomainChart;

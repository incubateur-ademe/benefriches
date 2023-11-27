import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { sharedChartConfig } from "../sharedChartConfig";

function SocioEconomicBenefitsComparisonByDomainChart() {
  const barChartOptions: Highcharts.Options = {
    ...sharedChartConfig,
    chart: {
      ...sharedChartConfig.chart,
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
        <strong>Domains concernés par les impacts socio-économiques</strong>
      </p>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default SocioEconomicBenefitsComparisonByDomainChart;

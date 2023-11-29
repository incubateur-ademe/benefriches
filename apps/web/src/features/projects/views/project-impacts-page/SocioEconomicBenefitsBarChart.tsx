import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function SocioEconomicBenefitsBarChart() {
  const barChartOptions: Highcharts.Options = {
    title: { text: "" },
    chart: {
      type: "column",
      backgroundColor: "transparent",
      style: { fontFamily: "Marianne" },
    },
    xAxis: {
      categories: ["Entreprises", "Collectivité", "Société humaine"],
    },
    yAxis: {
      title: { text: "" },
      min: 0,
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
    <div style={{ width: "50%" }}>
      <p>
        <strong>Bénéficiaires des impacts socio-économiques</strong>
      </p>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default SocioEconomicBenefitsBarChart;

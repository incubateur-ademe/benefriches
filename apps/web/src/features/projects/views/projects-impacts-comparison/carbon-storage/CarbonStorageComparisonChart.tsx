import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { sharedChartConfig } from "../sharedChartConfig";

function CarbonStorageComparisonChart() {
  const barChartOptions: Highcharts.Options = {
    ...sharedChartConfig,
    chart: {
      ...sharedChartConfig.chart,
      height: "400",
    },
    xAxis: {
      categories: ["Pas de projet", "Centrale photovoltaïque"],
      crosshair: false,
    },
    tooltip: {
      valueSuffix: " tonnes stockées",
    },
    plotOptions: {
      column: {
        stacking: "normal",
        pointPadding: 0.05,
        borderWidth: 0,
        dataLabels: { enabled: true, format: "{point.y} t stockées" },
      },
    },
    series: [
      {
        name: "Sol imperméabilisé (dont bâtiments)",
        data: [100, 200],
        type: "column",
      },
      { name: "Sol minéral", data: [100], type: "column" },
      { name: "Sol enherbé et arbustif", data: [100, 200], type: "column" },
      { name: "Prairie herbacée", data: [100, 200], type: "column" },
      { name: "Prairie arbustive", data: [200, 200], type: "column" },
      { name: "Forêt feuillue", data: [100, 200], type: "column" },
      { name: "Forêt conifère", data: [100, 200], type: "column" },
    ],
  };

  return (
    <div>
      <p>
        <strong>Stockage du carbone dans les sols</strong>
      </p>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default CarbonStorageComparisonChart;

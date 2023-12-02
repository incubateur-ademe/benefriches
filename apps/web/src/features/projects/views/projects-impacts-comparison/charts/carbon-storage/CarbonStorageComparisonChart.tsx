import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { sharedChartConfig } from "../../../shared/sharedChartConfig";

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
        dataLabels: { enabled: true, format: "{point.y} t" },
      },
    },
    series: [
      {
        name: "Sol imperméabilisé (dont bâtiments)",
        data: [90, 10],
        type: "column",
      },
      { name: "Sol minéral", data: [120, 68.51], type: "column" },
      { name: "Prairie arbustive", data: [246, 66.7], type: "column" },
      { name: "Prairie herbacée", data: [300, 831.7], type: "column" },
      { name: "Forêt de feuillus", data: [175.05, 103.8], type: "column" },
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

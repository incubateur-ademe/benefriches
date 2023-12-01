import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { sharedChartConfig } from "../../shared/sharedChartConfig";

function CarbonStorageChart() {
  const barChartOptions: Highcharts.Options = {
    ...sharedChartConfig,
    chart: {
      ...sharedChartConfig.chart,
      type: "area",
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
      area: {
        stacking: "normal",
        borderWidth: 0,
        dataLabels: { enabled: true, format: "{point.y} t stockées" },
      },
    },
    series: [
      {
        name: "Sol imperméabilisé (dont bâtiments)",
        data: [90, 10],
        type: "area",
      },
      { name: "Sol minéral", data: [120, 68.51], type: "area" },
      { name: "Prairie arbustive", data: [246, 66.7], type: "area" },
      { name: "Prairie herbacée", data: [300, 831.7], type: "area" },
      { name: "Forêt de feuillus", data: [175.05, 103.8], type: "area" },
    ],
  };

  return (
    <div>
      <p>
        <strong>Stockage du carbone dans les sols</strong>
      </p>
      <p>
        <strong>+571 t stockées</strong>
      </p>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default CarbonStorageChart;

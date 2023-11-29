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
        data: [157.5, 427.5],
        type: "area",
      },
      { name: "Sol minéral", data: [22.5, 0], type: "area" },
      { name: "Sol enherbé et arbustif", data: [247.5, 0], type: "area" },
      { name: "Prairie herbacée", data: [379.7, 0], type: "area" },
      { name: "Forêt mixte", data: [276, 0], type: "area" },
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

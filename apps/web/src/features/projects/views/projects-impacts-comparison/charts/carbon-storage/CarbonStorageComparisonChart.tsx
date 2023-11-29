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
        dataLabels: { enabled: true, format: "{point.y} t stockées" },
      },
    },
    series: [
      {
        name: "Sol imperméabilisé (dont bâtiments)",
        data: [157.5, 427.5],
        type: "column",
      },
      { name: "Sol minéral", data: [22.5], type: "column" },
      { name: "Sol enherbé et arbustif", data: [247.5], type: "column" },
      { name: "Prairie herbacée", data: [379.7], type: "column" },
      { name: "Forêt mixte", data: [276], type: "column" },
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

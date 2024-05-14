import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { baseColumnChartConfig } from "../../../shared/sharedChartConfig";

import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/services/format-number/formatNumber";

function PermeableSoilsImpactComparisonChart() {
  const barChartOptions: Highcharts.Options = {
    ...baseColumnChartConfig,
    xAxis: {
      categories: [""],
    },
    tooltip: {
      valueSuffix: ` ${SQUARE_METERS_HTML_SYMBOL}`,
    },
    plotOptions: {
      column: {
        pointPadding: 0.05,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: `{point.y:,.0f} ${SQUARE_METERS_HTML_SYMBOL}`,
        },
      },
    },
    series: [
      {
        type: "column",
        name: "Pas de changement",
        data: [97500],
      },
      {
        type: "column",
        name: "Centrale photovoltaïque",
        data: [146250],
      },
    ],
  };

  return (
    <div>
      <p>
        <strong>🌧 Surface perméable</strong>
      </p>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default PermeableSoilsImpactComparisonChart;

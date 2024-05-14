import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { baseColumnChartConfig } from "../../../shared/sharedChartConfig";

import { SQUARE_METERS_HTML_SYMBOL } from "@/shared/services/format-number/formatNumber";

function NonPollutedSoilsImpactComparisonChart() {
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
        data: [120000],
      },
      {
        type: "column",
        name: "Centrale photovoltaïque",
        data: [150000],
      },
    ],
  };

  return (
    <div>
      <p>
        <strong>✨ Surface non polluée</strong>
      </p>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default NonPollutedSoilsImpactComparisonChart;

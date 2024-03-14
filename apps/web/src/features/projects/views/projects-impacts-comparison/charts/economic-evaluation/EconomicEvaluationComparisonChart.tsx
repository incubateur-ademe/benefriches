import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { baseColumnChartConfig } from "../../../shared/sharedChartConfig";

type Props = {
  baseOwnerName: string;
  withOwnerName: string;
  withImpactValue: number;
  baseImpactValue: number;
};

function EconomicEvaluationComparisonChart({
  baseOwnerName,
  withOwnerName,
  withImpactValue,
  baseImpactValue,
}: Props) {
  const barChartOptions: Highcharts.Options = {
    ...baseColumnChartConfig,
    xAxis: {
      categories: [""],
    },
    tooltip: {
      valueSuffix: " €",
    },
    plotOptions: {
      column: {
        pointPadding: 0.05,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: "{point.y:,.0f} €",
        },
      },
    },
    series: [
      {
        type: "column",
        name: baseOwnerName,
        data: [baseImpactValue],
      },
      {
        type: "column",
        name: withOwnerName,
        data: [withImpactValue],
      },
    ],
  };

  return (
    <div>
      <p>
        <strong>💰 Bilan économique</strong>
      </p>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default EconomicEvaluationComparisonChart;

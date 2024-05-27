import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  getLabelForSocioEconomicImpactCategory,
  getNegativeSocioEconomicImpacts,
  getPositiveSocioEconomicImpacts,
  getTotalImpactsAmount,
  sumSocioEconomicImpactsByCategory,
} from "./socioEconomicImpacts";

import { ReconversionProjectImpacts } from "@/features/projects/domain/impacts.types";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { baseColumnChartConfig } from "@/features/projects/views/shared/sharedChartConfig.ts";
import { roundTo2Digits } from "@/shared/services/round-numbers/roundNumbers";

type Props = {
  socioEconomicImpacts: ReconversionProjectImpacts["socioeconomic"]["impacts"];
};

function SocioEconomicImpactsByCategoryChart({ socioEconomicImpacts }: Props) {
  const impactsSummedByCategory = sumSocioEconomicImpactsByCategory(socioEconomicImpacts);

  const positiveImpacts = getPositiveSocioEconomicImpacts(impactsSummedByCategory);
  const negativeImpacts = getNegativeSocioEconomicImpacts(impactsSummedByCategory);
  const totalPositiveImpactsAmount = getTotalImpactsAmount(positiveImpacts);
  const totalNegativeImpactsAmount = getTotalImpactsAmount(negativeImpacts);

  const negativeImpactsSeries = Array.from(negativeImpacts).map(([category, amount]) => ({
    name: getLabelForSocioEconomicImpactCategory(category),
    data: [roundTo2Digits(amount), 0],
    type: "column",
  })) as Array<Highcharts.SeriesOptionsType>;

  const positiveImpactsSeries = Array.from(positiveImpacts).map(([category, amount]) => ({
    name: getLabelForSocioEconomicImpactCategory(category),
    data: [0, roundTo2Digits(amount)],
    type: "column",
  })) as Array<Highcharts.SeriesOptionsType>;

  const barChartOptions: Highcharts.Options = {
    ...baseColumnChartConfig,
    xAxis: {
      categories: [
        `<strong>Négatif</strong><br>${formatMonetaryImpact(totalNegativeImpactsAmount)}`,
        `<strong>Positif</strong><br>${formatMonetaryImpact(totalPositiveImpactsAmount)}`,
      ],
      opposite: true,
    },
    tooltip: {
      valueSuffix: ` €`,
    },
    plotOptions: {
      column: {
        stacking: "normal",
      },
    },
    legend: {
      enabled: false,
    },
    series: [...negativeImpactsSeries, ...positiveImpactsSeries],
  };
  return (
    <HighchartsReact
      containerProps={{ className: "highcharts-no-xaxis" }}
      highcharts={Highcharts}
      options={barChartOptions}
    />
  );
}

export default SocioEconomicImpactsByCategoryChart;

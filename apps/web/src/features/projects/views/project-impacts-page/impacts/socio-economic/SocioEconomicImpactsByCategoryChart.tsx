import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { baseColumnChartConfig } from "../../../shared/sharedChartConfig";
import {
  getLabelForSocioEconomicImpactCategory,
  getNegativeSocioEconomicImpacts,
  getPositiveSocioEconomicImpacts,
  getTotalImpactsAmount,
  sumSocioEconomicImpactsByCategory,
} from "./socioEconomicImpacts";

import { ReconversionProjectImpacts } from "@/features/projects/domain/impacts.types";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
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
  const maxAbsValue = Math.max(totalPositiveImpactsAmount, Math.abs(totalNegativeImpactsAmount));

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
        `<strong>Négatif</strong><br>${formatNumberFr(totalNegativeImpactsAmount)} €`,
        `<strong>Positif</strong><br>+${formatNumberFr(totalPositiveImpactsAmount)} €`,
      ],
      lineWidth: 0,
    },
    yAxis: {
      min: -maxAbsValue,
      max: maxAbsValue,
      startOnTick: false,
      endOnTick: false,
      title: { text: null },
      plotLines: [
        {
          value: 0,
          width: 2,
          color: "#929292",
        },
      ],
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
      layout: "vertical",
      align: "right",
      width: "40%",
      verticalAlign: "middle",
    },

    series: [...negativeImpactsSeries, ...positiveImpactsSeries],
  };
  return <HighchartsReact highcharts={Highcharts} options={barChartOptions} />;
}

export default SocioEconomicImpactsByCategoryChart;

import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { baseColumnChartConfig } from "../../../shared/sharedChartConfig";
import ImpactCard from "../../ImpactChartCard";

import { ReconversionProjectImpacts } from "@/features/projects/domain/impacts.types";
import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { roundTo2Digits } from "@/shared/services/round-numbers/roundNumbers";

type Props = {
  economicBalanceTotal: number;
  socioEconomicImpacts: ReconversionProjectImpacts["socioeconomic"];
};

function CostBenefitAnalysisCard({ economicBalanceTotal, socioEconomicImpacts }: Props) {
  const socioEconomicImpactTotal = socioEconomicImpacts.impacts
    .map(({ amount }) => amount)
    .reduce((total, amount) => total + amount, 0);

  const maxAbsValue =
    Math.abs(economicBalanceTotal) > Math.abs(socioEconomicImpactTotal)
      ? Math.abs(economicBalanceTotal)
      : Math.abs(socioEconomicImpactTotal);

  const barChartOptions: Highcharts.Options = {
    ...baseColumnChartConfig,
    chart: {
      ...baseColumnChartConfig.chart,
      height: "100%",
    },
    xAxis: {
      categories: [
        `<strong>Bilan de l’opération</strong><br>${formatNumberFr(economicBalanceTotal)} €`,
        `<strong>Impacts socio-économiques</strong><br>+${formatNumberFr(socioEconomicImpactTotal)} €`,
      ],
      lineWidth: 0,
    },
    yAxis: {
      min: -maxAbsValue,
      max: maxAbsValue,
      startOnTick: false,
      endOnTick: false,
      tickAmount: 3,
      title: {
        text: null,
      },
      plotLines: [
        {
          value: 0,
          width: 2,
        },
      ],
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      formatter: function () {
        return `<span style="font-size: 0.8em;">${this.series.name}</span><br>${this.point.name} : <strong>${formatNumberFr(this.y ?? 0)} €</strong>`;
      },
    },
    series: [
      {
        name: "Analyse coûts bénéfices",
        data: [
          { y: roundTo2Digits(economicBalanceTotal), name: "Bilan de l’opération" },
          { y: roundTo2Digits(socioEconomicImpactTotal), name: "Impacts socio-économiques" },
        ],
        type: "column",
      },
    ],
  };

  return (
    <ImpactCard title="Analyse coûts bénéfices">
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </ImpactCard>
  );
}

export default CostBenefitAnalysisCard;

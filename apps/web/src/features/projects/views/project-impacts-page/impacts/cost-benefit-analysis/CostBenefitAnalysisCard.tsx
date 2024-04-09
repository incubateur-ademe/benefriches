import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { baseColumnChartConfig } from "../../../shared/sharedChartConfig";
import ImpactCard from "../../ImpactChartCard";

import { formatNumberFr } from "@/shared/services/format-number/formatNumber";
import { roundTo2Digits } from "@/shared/services/round-numbers/roundNumbers";

type Props = {
  economicBalanceTotal: number;
  socioEconomicImpactsTotal: number;
  onTitleClick: () => void;
};

function CostBenefitAnalysisCard({
  economicBalanceTotal,
  socioEconomicImpactsTotal,
  onTitleClick,
}: Props) {
  const maxAbsValue =
    Math.abs(economicBalanceTotal) > Math.abs(socioEconomicImpactsTotal)
      ? Math.abs(economicBalanceTotal)
      : Math.abs(socioEconomicImpactsTotal);

  const barChartOptions: Highcharts.Options = {
    ...baseColumnChartConfig,
    chart: {
      ...baseColumnChartConfig.chart,
      height: "100%",
    },
    xAxis: {
      categories: [
        `<strong>Bilan de l’opération</strong><br>${formatNumberFr(economicBalanceTotal)} €`,
        `<strong>Impacts socio-économiques</strong><br>+${formatNumberFr(socioEconomicImpactsTotal)} €`,
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
          { y: roundTo2Digits(socioEconomicImpactsTotal), name: "Impacts socio-économiques" },
        ],
        type: "column",
      },
    ],
  };

  return (
    <ImpactCard title="Analyse coûts bénéfices" onTitleClick={onTitleClick}>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </ImpactCard>
  );
}

export default CostBenefitAnalysisCard;

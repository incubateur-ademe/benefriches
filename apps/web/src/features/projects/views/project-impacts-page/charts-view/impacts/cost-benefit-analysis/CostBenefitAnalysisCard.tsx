import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ImpactCard from "../../ImpactChartCard/ImpactChartCard";

import { baseColumnChartConfig } from "@/features/projects/views/shared/sharedChartConfig.ts";
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
  const barChartOptions: Highcharts.Options = {
    ...baseColumnChartConfig,
    chart: {
      ...baseColumnChartConfig.chart,
      height: "100%",
    },
    xAxis: {
      categories: [
        `<strong>Bilan de l'opération</strong><br>${formatNumberFr(economicBalanceTotal)} €`,
        `<strong>Impacts socio-économiques</strong><br>+${formatNumberFr(socioEconomicImpactsTotal)} €`,
      ],
      opposite: true,
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
          { y: roundTo2Digits(economicBalanceTotal), name: "Bilan de l'opération" },
          { y: roundTo2Digits(socioEconomicImpactsTotal), name: "Impacts socio-économiques" },
        ],
        type: "column",
      },
    ],
  };

  return (
    <ImpactCard title="Analyse coûts bénéfices" onTitleClick={onTitleClick}>
      <HighchartsReact
        containerProps={{ className: "highcharts-no-xaxis" }}
        highcharts={Highcharts}
        options={barChartOptions}
      />
    </ImpactCard>
  );
}

export default CostBenefitAnalysisCard;

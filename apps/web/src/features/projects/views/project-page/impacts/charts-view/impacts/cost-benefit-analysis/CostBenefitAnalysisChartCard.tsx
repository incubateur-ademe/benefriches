import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { baseColumnChartConfig } from "@/features/projects/views/shared/sharedChartConfig.ts";

import ImpactsChartsSection from "../../ImpactsChartsSection";

type Props = {
  economicBalanceTotal: number;
  socioEconomicTotalImpact: number;
};

function CostBenefitAnalysisChartCard({ economicBalanceTotal, socioEconomicTotalImpact }: Props) {
  const barChartOptions: Highcharts.Options = {
    ...baseColumnChartConfig,
    xAxis: {
      categories: [
        `<strong>Bilan de l'opération</strong><br>${formatMonetaryImpact(economicBalanceTotal)}`,
        `<strong>Impacts socio-économiques</strong><br>${formatMonetaryImpact(socioEconomicTotalImpact)}`,
      ],
    },
    tooltip: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        name: "Analyse coûts/bénéfices",
        type: "column",
        data: [economicBalanceTotal, socioEconomicTotalImpact],
      },
    ],
  };

  return (
    <ImpactsChartsSection title="Analyse coûts/bénéfices">
      <HighchartsReact
        containerProps={{ className: "highcharts-no-xaxis" }}
        highcharts={Highcharts}
        options={barChartOptions}
      />
    </ImpactsChartsSection>
  );
}

export default CostBenefitAnalysisChartCard;

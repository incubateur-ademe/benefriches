import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { withDefaultBarChartOptions } from "@/shared/views/charts";

import ImpactColumnChartCard from "../../ImpactChartCard/ImpactColumnChartCard";

type Props = {
  economicBalanceTotal: number;
  socioEconomicTotalImpact: number;
};

function CostBenefitAnalysisChartCard({ economicBalanceTotal, socioEconomicTotalImpact }: Props) {
  const barChartOptions: Highcharts.Options = withDefaultBarChartOptions({
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
  });

  return (
    <ImpactColumnChartCard
      title="Analyse coûts/bénéfices"
      dialogId="cost_benefit_analysis-chart"
      onOpenDialogArgs={{
        sectionName: "charts",
        impactName: "cost_benefit_analysis",
      }}
    >
      <HighchartsReact
        containerProps={{ className: "highcharts-no-xaxis" }}
        highcharts={Highcharts}
        options={barChartOptions}
      />
    </ImpactColumnChartCard>
  );
}

export default CostBenefitAnalysisChartCard;

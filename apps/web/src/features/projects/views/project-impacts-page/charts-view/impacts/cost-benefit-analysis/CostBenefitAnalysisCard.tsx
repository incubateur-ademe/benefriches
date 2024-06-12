import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import ImpactCard from "../../ImpactChartCard/ImpactChartCard";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { baseColumnChartConfig } from "@/features/projects/views/shared/sharedChartConfig.ts";
import { roundTo2Digits } from "@/shared/services/round-numbers/roundNumbers";

type Props = {
  economicBalanceTotal: number;
  socioEconomicImpactsTotal: number;
  economicBalanceBearer?: string;
  onTitleClick: () => void;
};

function CostBenefitAnalysisCard({
  economicBalanceTotal,
  socioEconomicImpactsTotal,
  economicBalanceBearer = "Aménageur",
  onTitleClick,
}: Props) {
  const highchartPoints = [
    {
      y: roundTo2Digits(economicBalanceTotal),
      name: "Bilan de l'opération",
      customTooltip: `<strong>${economicBalanceBearer}</strong> : ${formatMonetaryImpact(economicBalanceTotal)}`,
    },
    {
      y: roundTo2Digits(socioEconomicImpactsTotal),
      name: "Impacts socio-économiques",
      customTooltip: `<strong>Bien commun</strong> : ${formatMonetaryImpact(socioEconomicImpactsTotal)}`,
    },
  ];

  const barChartOptions: Highcharts.Options = {
    ...baseColumnChartConfig,
    chart: {
      ...baseColumnChartConfig.chart,
      height: "100%",
    },
    xAxis: {
      categories: [
        `<strong>Bilan de l'opération</strong><br>${formatMonetaryImpact(economicBalanceTotal)}`,
        `<strong>Impacts socio-économiques</strong><br>${formatMonetaryImpact(socioEconomicImpactsTotal)}`,
      ],
      opposite: true,
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      format: "{point.customTooltip}",
    },
    series: [
      {
        name: "Analyse coûts bénéfices",
        data: highchartPoints,
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

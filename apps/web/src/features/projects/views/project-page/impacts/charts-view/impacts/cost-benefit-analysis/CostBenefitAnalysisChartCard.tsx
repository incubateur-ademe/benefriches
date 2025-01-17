import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useContext } from "react";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { baseColumnChartConfig } from "@/features/projects/views/shared/sharedChartConfig.ts";

import { ImpactModalDescriptionContext } from "../../../impact-description-modals/ImpactModalDescriptionContext";
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

  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  const projectBalance = economicBalanceTotal + socioEconomicTotalImpact;

  return (
    <ImpactsChartsSection
      title="Analyse coûts/bénéfices"
      onClick={() => {
        openImpactModalDescription({
          sectionName: "summary",
          impactData: {
            name: "projectImpactBalance",
            value: {
              economicBalanceTotal,
              socioEconomicMonetaryImpactsTotal: socioEconomicTotalImpact,
              projectBalance,
            },
            isSuccess: projectBalance > 0,
          },
        });
      }}
    >
      <HighchartsReact
        containerProps={{ className: "highcharts-no-xaxis" }}
        highcharts={Highcharts}
        options={barChartOptions}
      />
    </ImpactsChartsSection>
  );
}

export default CostBenefitAnalysisChartCard;

import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";
import { withDefaultBarChartOptions } from "@/shared/views/charts";

import ImpactModalDescription, {
  ModalDataProps,
} from "../../../impact-description-modals/ImpactModalDescription";
import ImpactColumnChartCard from "../../ImpactChartCard/ImpactColumnChartCard";

type Props = {
  economicBalanceTotal: number;
  socioEconomicTotalImpact: number;
  modalData: ModalDataProps;
};

const DIALOG_ID = "fr-modal-impacts-cost_benefit_analysis-Chart";

function CostBenefitAnalysisChartCard({
  economicBalanceTotal,
  socioEconomicTotalImpact,
  modalData,
}: Props) {
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
    <>
      <ImpactModalDescription
        dialogId={DIALOG_ID}
        {...modalData}
        initialState={{
          sectionName: "charts",
          impactName: "cost_benefit_analysis",
        }}
      />

      <ImpactColumnChartCard title="Analyse coûts/bénéfices" dialogId={DIALOG_ID}>
        <HighchartsReact
          containerProps={{ className: "highcharts-no-xaxis" }}
          highcharts={Highcharts}
          options={barChartOptions}
        />
      </ImpactColumnChartCard>
    </>
  );
}

export default CostBenefitAnalysisChartCard;

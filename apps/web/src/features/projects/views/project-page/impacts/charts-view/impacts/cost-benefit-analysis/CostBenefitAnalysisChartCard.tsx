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

      <ImpactColumnChartCard
        title="Analyse coûts/bénéfices"
        dialogId={DIALOG_ID}
        data={[
          {
            value: economicBalanceTotal,
            label: "Bilan de l'opération",
          },
          {
            value: socioEconomicTotalImpact,
            label: "Impacts socio-économiques",
          },
        ]}
      />
    </>
  );
}

export default CostBenefitAnalysisChartCard;

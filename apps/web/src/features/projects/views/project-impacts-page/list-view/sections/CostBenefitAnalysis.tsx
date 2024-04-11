import ImpactItemRow from "../ImpactItemRow";
import ImpactLabel from "../ImpactLabel";
import ImpactMainTitle from "../ImpactMainTitle";
import ImpactValue from "../ImpactValue";

import { ReconversionProjectImpacts } from "@/features/projects/domain/impacts.types";
import { ImpactDescriptionModalCategory } from "@/features/projects/views/project-impacts-page/modals/ImpactDescriptionModalWizard";

type Props = {
  socioEconomicImpactTotal: ReconversionProjectImpacts["socioeconomic"]["total"];
  economicBalanceImpactTotal: ReconversionProjectImpacts["economicBalance"]["total"];
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const CostBenefitAnalysisListSection = ({
  socioEconomicImpactTotal,
  economicBalanceImpactTotal,
  openImpactDescriptionModal,
}: Props) => {
  return (
    <section className="fr-mb-5w">
      <ImpactMainTitle
        title="Analyse coûts bénéfices"
        onClick={() => {
          openImpactDescriptionModal("cost-benefit-analysis");
        }}
      />
      <ImpactItemRow
        onClick={() => {
          openImpactDescriptionModal("economic-balance");
        }}
      >
        <ImpactLabel>📉 Bilan de l'opération</ImpactLabel>
        <ImpactValue isTotal value={economicBalanceImpactTotal} type="monetary" />
      </ImpactItemRow>
      <ImpactItemRow
        onClick={() => {
          openImpactDescriptionModal("socio-economic");
        }}
      >
        <ImpactLabel>🌎 Impacts socio-économiques</ImpactLabel>
        <ImpactValue isTotal value={socioEconomicImpactTotal} type="monetary" />
      </ImpactItemRow>
    </section>
  );
};

export default CostBenefitAnalysisListSection;

import ImpactItemRow from "../ImpactItemRow";
import ImpactLabel from "../ImpactLabel";
import ImpactMainTitle from "../ImpactMainTitle";
import ImpactValue from "../ImpactValue";

import { ReconversionProjectImpacts } from "@/features/projects/domain/impacts.types";
import { ImpactDescriptionModalCategory } from "@/features/projects/views/project-impacts-page/modals/ImpactDescriptionModalWizard";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

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
        <ImpactValue>{formatMonetaryImpact(economicBalanceImpactTotal)}</ImpactValue>
      </ImpactItemRow>
      <ImpactItemRow
        onClick={() => {
          openImpactDescriptionModal("socio-economic");
        }}
      >
        <ImpactLabel>🌎 Impacts socio-économiques</ImpactLabel>
        <ImpactValue>{formatMonetaryImpact(socioEconomicImpactTotal)}</ImpactValue>
      </ImpactItemRow>
    </section>
  );
};

export default CostBenefitAnalysisListSection;
